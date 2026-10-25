import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {createServer} from 'node:http'
import {Context} from '@deepseek-ai/cordis'
import MemoryWikiService from '../lib/server/index.js'
import { TYPERT } from '../lib/typert.host.js'
import {ExperienceCapture,JevJudge,WikiIngest} from '../lib/server/capture.js'

test('completed original turn persists two real protocol decisions and publication, readable through disabled service',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'capture-history-integration-'))
 t.after(()=>fs.rm(root,{recursive:true,force:true}))
 const oldHome=process.env.DSH_HOME
 process.env.DSH_HOME=path.join(root,'home')
 t.after(()=>{if(oldHome===undefined)delete process.env.DSH_HOME;else process.env.DSH_HOME=oldHome})
 const wiki=path.join(root,'wiki'),skill=path.join(root,'skill')
 for(const dir of ['wiki/sources','wiki/concepts','wiki/synthesis','wiki/entities','wiki/outputs','tools'])await fs.mkdir(path.join(wiki,dir),{recursive:true})
 await fs.mkdir(path.join(skill,'references'),{recursive:true})
 for(const file of ['SKILL.md','references/operations.md','references/page-templates.md'])await fs.writeFile(path.join(skill,file),'Read evidence and preserve original judgments.\n')
 await fs.writeFile(path.join(wiki,'AGENTS.md'),'# Schema\n<!-- dsh-memory-wiki:auto-capture=v1 -->\n')
 await fs.writeFile(path.join(wiki,'wiki/index.md'),'# Index\n<!-- wiki-index:auto-end -->\n')
 await fs.writeFile(path.join(wiki,'wiki/log.md'),'# Log\n')
 for(const file of ['wiki-index.mjs','wiki-lint.mjs'])await fs.writeFile(path.join(wiki,'tools',file),"console.log('controlled Wiki command')")
 const dataRoot=path.join(process.env.DSH_HOME,'storages/memory-wiki-auto-capture',createHash('sha256').update(await fs.realpath(wiki)).digest('hex'))
 const requests=[]
 const server=createServer(async(req,res)=>{
  let raw='';for await(const chunk of req)raw+=chunk
  const body=JSON.parse(raw);requests.push(body)
  const values={activity:'coding',lesson_kind:'verified_fix',relationship:'new'}
  const answers=Object.fromEntries(Object.entries(body.questions).map(([id,question])=>[id,question.type==='noul'?{type:'noul',noul:1}:{type:'choice',choice:values[id]??'supported',confidence:1,probabilities:Object.fromEntries(Object.keys(question.criteria).map(option=>[option,option===(values[id]??'supported')?1:0]))}]))
  res.setHeader('content-type','application/json');res.setHeader('x-typesafe-request-id','controlled-'+requests.length)
  res.end(JSON.stringify({model:body.model,answers,usage:{input_tokens:42,output_tokens:null}}))
 })
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close())
 const judge=new JevJudge({apiKey:'controlled-key',model:'typesafe/jev-1.14.0',baseURL:`http://127.0.0.1:${server.address().port}/provider/v1`})
 const ingest=new WikiIngest({wikiRoot:wiki,dataRoot,skillPath:path.join(skill,'SKILL.md'),generate:async input=>{
  const event=input.evidence.events.find(event=>event.kind==='tool/result')
  const claim='Observed a repeated request in this bounded test.'
  return{claims:[{text:claim,evidenceRefs:[event.seq],quotes:[{seq:event.seq,text:event.text}]}],updates:[{path:'wiki/synthesis/observed-retry.md',content:`---\ntype: synthesis\nkind: incident\ntitle: Observed retry\ndate: 2026-10-25\nstatus: settled\ndomain: tool\nsources: ["${input.sourceRef}"]\n---\n# Observed retry\n\n${claim}\n\n[[${input.sourceRef}|Original evidence]]\n`}]}
 }})
 const events=[{seq:0,type:'turn/start',data:{turn:1}},{seq:1,type:'user/message',data:{source:{kind:'user'},content:[{type:'text',text:'Diagnose this repeated request'}]}},{seq:2,type:'request/header',data:{header:{config:{provider:'controlled',model:'writer'}}}},{seq:3,type:'tool/result',data:{message:{content:[{type:'text',text:'Observed repeated request.'}]}}},{seq:4,type:'turn/end',data:{turn:1,reason:{kind:'completed'}}}]
 const capture=new ExperienceCapture({wikiRoot:wiki,dataRoot,judge,ingest,readEvents:async()=>events})
 capture.observe({id:'integration-session',header:{cwd:root}},events.at(-1));await capture.whenIdle()
 assert.equal(capture.getCapture('integration-session').phase,'ingested')
 await capture.dispose()
 assert.equal(requests.length,2)
 const ctx=new Context()
 ctx.provide('sessions',{get:id=>id==='integration-session'?{id}:undefined})
 ctx.provide('systemPrompt',{section:()=>()=>{}})
 const service=new MemoryWikiService(ctx,{enabled:true,wikiRoot:wiki,capture:{enabled:false}})
 assert.equal((await service.captureStatus({sessionId:'integration-session'})).collector,'disabled')
 const history=await service.captureHistory({sessionId:'integration-session'})
 assert.equal(history.items.length,1)
 const validate=(method,value)=>assert.equal(TYPERT.invocations.find(invocation=>invocation.method===method).result.create().safeParse(value).success,true,method+' result matches generated schema')
 validate('captureHistory',history)
 validate('captureStatus',await service.captureStatus({}))
 const jobId=history.items[0].jobId
 const detail=await service.captureRecord({sessionId:'integration-session',jobId})
 validate('captureRecord',detail)
 assert.equal(detail.judgments.length,2)
 assert.ok(detail.events.some(event=>event.kind==='publication_finished'))
 for(const summary of detail.judgments){
  const result=await service.captureJudgment({sessionId:'integration-session',jobId,judgmentId:summary.id})
  validate('captureJudgment',result)
  assert.equal(result.lifecycle.state,'completed')
  assert.ok(result.judgment.questions.length>=4)
  assert.equal(result.judgment.result.usage.outputTokens,null)
  assert.ok(result.judgment.result.requestId.startsWith('controlled-'))
 }
 assert.equal((await service.captureRecord({sessionId:'missing',jobId})).error.code,'unknown-session')
 assert.match(await fs.readFile(path.join(wiki,'wiki/synthesis/observed-retry.md'),'utf8'),/Observed a repeated request/)
})
