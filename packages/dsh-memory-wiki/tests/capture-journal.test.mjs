import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { CaptureJournal } from '../lib/server/capture.js'

const id = 'a'.repeat(64)
const legacy = (jobId=id,sessionId='session',turnEndSeq=10) => ({jobId,phase:'skipped',reason:'无需沉淀',pages:[],updatedAt:'2026-10-25T01:00:00.000Z',rubricVersion:'coding-experience-v1',authorization:'fixture',evidence:{jobId,origin:{sessionId,turn:1,turnStartSeq:1,turnEndSeq},outcome:'completed',workspaceIdentity:'fixture',requestedTask:'修复图谱刷新',events:[],changes:[],checks:[],limitations:[],contentHash:'evidence'}})

test('history reads legacy snapshots without writing, scopes records and stays independent of capture',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'capture-journal-'))
 try {
  fs.writeFileSync(path.join(root,id+'.json'),JSON.stringify(legacy()))
  const before=fs.readFileSync(path.join(root,id+'.json'),'utf8')
  const journal=new CaptureJournal(root)
  const result=journal.list({sessionId:'session'})
  assert.equal(result.items[0].historyCoverage,'legacy_snapshot')
  assert.equal(result.items[0].registeredAt,undefined)
  assert.equal(journal.list({sessionId:'other'}).items.length,0)
  assert.equal(journal.record({sessionId:'other',jobId:id}).error.code,'capture-record-unavailable')
  assert.equal(fs.readFileSync(path.join(root,id+'.json'),'utf8'),before)
 }finally{fs.rmSync(root,{recursive:true,force:true})}
})

test('attempt lifecycle survives restart without inventing a result, then retains a later decision',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'capture-journal-'))
 try{
  fs.writeFileSync(path.join(root,id+'.json'),JSON.stringify(legacy()))
  const journal=new CaptureJournal(root),job=journal.load(id)
  journal.append(job,{kind:'phase_changed',phase:'judging',reason:'初判'})
  const first=journal.start(job,'assessment',{model:'fixture',requestHash:'request',questions:[]})
  const resumed=new CaptureJournal(root),loaded=resumed.load(id)
  resumed.recover(loaded)
  assert.equal(resumed.judgment({sessionId:'session',jobId:id,judgmentId:first}).lifecycle.state,'interrupted')
  assert.equal(resumed.judgment({sessionId:'session',jobId:id,judgmentId:first}).judgment.result,undefined)
  const second=resumed.start(loaded,'assessment',{model:'fixture',requestHash:'request',questions:[]})
  resumed.finish(loaded,second,{kind:'decision',answers:[],gateResults:[],disposition:'deferred',reasonCode:'low',reason:'缺少证据',usage:{inputTokens:null,outputTokens:2}},12)
  assert.equal(resumed.judgment({sessionId:'session',jobId:id,judgmentId:second}).lifecycle.durationMs,12)
  assert.equal(resumed.judgment({sessionId:'session',jobId:id,judgmentId:second}).judgment.result.usage.inputTokens,null)
  assert.throws(()=>resumed.finish(loaded,second,{},1),/already ended/)
  assert.equal(new CaptureJournal(root).record({sessionId:'session',jobId:id}).judgments.length,2)
 }finally{fs.rmSync(root,{recursive:true,force:true})}
})

test('history filters before keyset pagination, reloads disk and rejects foreign cursors and corruption',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'capture-journal-'))
 try{
  const journal=new CaptureJournal(root)
  for(let i=1;i<=5;i++)fs.writeFileSync(path.join(root,String(i).repeat(64)+'.json'),JSON.stringify({...legacy(String(i).repeat(64),'session',i),phase:i%2?'skipped':'failed'}))
  const page=journal.list({sessionId:'session',status:'skipped',limit:2})
  assert.deepEqual(page.items.map(item=>item.origin.turnEndSeq),[5,3])
  assert.deepEqual(journal.list({sessionId:'session',status:'skipped',limit:2,cursor:page.nextCursor}).items.map(item=>item.origin.turnEndSeq),[1])
  assert.equal(journal.list({sessionId:'other',status:'skipped',cursor:page.nextCursor}).error.code,'capture-invalid-query')
  assert.equal(journal.list({sessionId:'session',limit:0}).error.field,'limit')
  assert.equal(journal.list({sessionId:'session',status:'invented'}).error.field,'status')
  fs.writeFileSync(path.join(root,id+'.json'),'{bad json')
  assert.equal(journal.scan().history,'degraded')
  assert.equal(journal.list({sessionId:'session'}).readCompleteness,'partial')
  assert.equal(journal.list({sessionId:'session'}).items.length,5)
  assert.equal(journal.record({sessionId:'session',jobId:'../outside'}).error.code,'capture-record-unavailable')
 }finally{fs.rmSync(root,{recursive:true,force:true})}
})

test('read-only history facade checks sessions and allows historical queries while disabled',async()=>{
 const {CaptureHistory}=await import('../lib/server/capture.js')
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'capture-journal-'))
 try{
  fs.writeFileSync(path.join(root,id+'.json'),JSON.stringify(legacy()))
  const history=new CaptureHistory(new CaptureJournal(root),sessionId=>sessionId==='session'?undefined:{code:'unknown-session',sessionId},()=>({collector:'disabled',reason:'未启用'}))
  assert.equal(history.status({}).collector,'disabled')
  assert.equal(history.status({}).lastIssue,undefined)
  assert.equal(history.list({sessionId:'session'}).items.length,1)
  assert.equal(history.list({sessionId:'unknown'}).error.code,'unknown-session')
  assert.equal(history.record({sessionId:'unknown',jobId:id}).summary,undefined)
 }finally{fs.rmSync(root,{recursive:true,force:true})}
})

test('unknown versions, renamed files, incomplete registration and invalid answer shapes degrade rather than leak',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'capture-journal-'))
 try{
  fs.writeFileSync(path.join(root,id+'.json'),JSON.stringify(legacy()))
  const journal=new CaptureJournal(root),job=journal.load(id)
  journal.append(job,{kind:'phase_changed',phase:'judging',reason:'judge'})
  const attempt=journal.start(job,'assessment',{model:'fixture',requestHash:'request',questions:[]})
  journal.finish(job,attempt,{kind:'decision',answers:[],gateResults:[],disposition:'skipped',reasonCode:'none',reason:'No lesson'},1)
  const file=path.join(root,id+'.json')
  const original=JSON.parse(fs.readFileSync(file,'utf8'))
  const injected=structuredClone(original)
  injected.judgments[0].extraPrivateValue='should-not-leak'
  injected.judgments[0].result.extraPrivateValue='should-not-leak'
  injected.events[1].extraPrivateValue='should-not-leak'
  fs.writeFileSync(file,JSON.stringify(injected))
  assert.equal(JSON.stringify(journal.judgment({sessionId:'session',jobId:id,judgmentId:attempt})).includes('should-not-leak'),false)
  assert.equal(JSON.stringify(journal.record({sessionId:'session',jobId:id})).includes('should-not-leak'),false)
  for(const invalid of [{...original,schemaVersion:99},{...original,historyCoverage:'complete',registeredAt:original.updatedAt},{...original,judgments:[{...original.judgments[0],result:{...original.judgments[0].result,answers:[{id:'bad'}]}}]}]){
   fs.writeFileSync(file,JSON.stringify(invalid))
   assert.equal(journal.scan().history,'degraded')
   assert.equal(journal.list({sessionId:'session'}).items.length,0)
  }
  fs.writeFileSync(file,JSON.stringify(original))
  fs.writeFileSync(path.join(root,'renamed-job.json'),JSON.stringify(original))
  assert.equal(journal.scan().history,'degraded')
  const invalidCursor=Buffer.from(JSON.stringify({sessionId:'session',upper:0,seq:999,id})).toString('base64url')
  assert.equal(journal.list({sessionId:'session',cursor:invalidCursor}).error.field,'cursor')
 }finally{fs.rmSync(root,{recursive:true,force:true})}
})
