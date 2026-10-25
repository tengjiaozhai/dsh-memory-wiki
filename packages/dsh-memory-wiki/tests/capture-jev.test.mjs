import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createHostCapture, JevJudge } from '../lib/server/capture.js'

test('CommandCode Jev uses the versioned Provider API without duplicating v1', async t => {
  let request
  const server = createServer(async (req, res) => {
    let raw = ''
    for await (const chunk of req) raw += chunk
    request = { path: req.url, authorization: req.headers.authorization, body: JSON.parse(raw) }
    res.setHeader('content-type', 'application/json')
    res.setHeader('x-typesafe-request-id', 'fixture-request')
    res.end(JSON.stringify({ model: 'typesafe/jev-1.14.0', answers: {
      activity: { type: 'choice', choice: 'coding', confidence: .99, probabilities: { coding: .995, non_coding: .003, unclear: .002 } },
      lesson_kind: { type: 'choice', choice: 'failed_approach', confidence: .99, probabilities: { verified_fix: 0, failed_approach: 1, workflow_lesson: 0, none: 0, unclear: 0 } },
      lasting_value: { type: 'noul', noul: .99 }, evidence_sufficient: { type: 'noul', noul: .99 },
    }, usage: { input_tokens: 30, output_tokens: 10 } }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => server.close())
  const judge = new JevJudge({ apiKey: 'test-key', baseURL: `http://127.0.0.1:${server.address().port}/provider/v1/`, model: 'typesafe/jev-1.14.0' })
  const decision = await judge.assess({ requestedTask: 'Fix a failed build', events: [], limitations: [] }, new AbortController().signal)
  assert.equal(request.path, '/provider/v1/systemone')
  assert.equal(request.authorization, 'Bearer test-key')
  assert.equal(request.body.model, 'typesafe/jev-1.14.0')
  assert.equal(request.body.questions.activity.type, 'choice')
  assert.equal(request.body.questions.lasting_value.type, 'noul')
  assert.equal(decision.disposition, 'prepare')
  assert.equal(decision.model, 'typesafe/jev-1.14.0')
  assert.equal(decision.audit.requestId, 'fixture-request')
  assert.deepEqual(decision.audit.usage, { inputTokens: 30, outputTokens: 10 })
  assert.equal(decision.audit.answers.find(answer => answer.id === 'activity').choice, 'coding')
  assert.equal(decision.audit.gateResults.find(gate => gate.id === 'activity.probability').expected, .95)
})

test('old direct model IDs and an unversioned API root are explicitly rejected', () => {
  assert.throws(() => new JevJudge({ apiKey: 'test', model: 'jev-1.14.0' }), /CommandCode Jev/)
  assert.throws(() => new JevJudge({ apiKey: 'test', model: 'typesafe/jev' }), /固定版本/)
  assert.throws(() => new JevJudge({ apiKey: 'test', model: 'typesafe/jev-1.15.0' }), /固定版本/)
  assert.throws(() => new JevJudge({ apiKey: 'test', model: 'typesafe/jev-1.14.0', baseURL: 'https://api.commandcode.ai/provider' }), /end with \/v1/)
  assert.throws(() => new JevJudge({ apiKey: 'test', model: 'typesafe/jev-1.14.0', baseURL: 'http://example.com/provider/v1' }), /HTTPS/)
})

test('host uses the CommandCode key file or CMD_API_KEY and ignores old TypeSafe settings', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'commandcode-host-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const keys = ['DSH_HOME', 'CMD_API_KEY', 'TYPESAFE_API_KEY', 'TYPESAFE_BASE_URL']
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]))
  t.after(() => { for (const key of keys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key] } })
  process.env.DSH_HOME = path.join(root, 'home')
  process.env.TYPESAFE_API_KEY = 'old-key-must-not-be-used'
  process.env.TYPESAFE_BASE_URL = 'http://old-endpoint.invalid'
  const wikiRoot = path.join(root, 'wiki')
  const credentials = path.join(root, 'home/credentials')
  await fs.mkdir(wikiRoot)
  await fs.mkdir(credentials, { recursive: true })
  await fs.writeFile(path.join(credentials, 'memory-wiki-commandcode.key'), 'commandcode-file-key\n', { mode: 0o600 })
  const requests = []
  const server = createServer(async (req, res) => {
    let raw = ''
    for await (const chunk of req) raw += chunk
    const body = JSON.parse(raw)
    requests.push({ path: req.url, authorization: req.headers.authorization, model: body.model })
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ model: body.model, answers: {
      activity: { type: 'choice', choice: 'non_coding', confidence: 1, probabilities: { coding: 0, non_coding: 1, unclear: 0 } },
      lesson_kind: { type: 'choice', choice: 'none', confidence: 1, probabilities: { verified_fix: 0, failed_approach: 0, workflow_lesson: 0, none: 1, unclear: 0 } },
      lasting_value: { type: 'noul', noul: 0 }, evidence_sufficient: { type: 'noul', noul: 0 },
    }, usage: { input_tokens: 30, output_tokens: 10 } }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => server.close())
  for (const [name, key] of [['file', undefined], ['env', 'commandcode-env-key']]) {
    if (key === undefined) delete process.env.CMD_API_KEY; else process.env.CMD_API_KEY = key
    const events = [{ seq: 0, type: 'turn/start', data: { turn: 1 } }, { seq: 1, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'Hello' }] } }, { seq: 2, type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }]
    const capture = createHostCapture({ llm: {}, sessionQuery: { readSession: async () => ({ events }) } }, wikiRoot,
      { enabled: true, judgeModel: 'typesafe/jev-1.14.0', judgeBaseURL: `http://127.0.0.1:${server.address().port}/provider/v1`, skillPath: path.join(root, 'SKILL.md') },
      { publishing: () => assert.fail('Greeting must not publish'), published: () => assert.fail('Greeting must not publish') })
    capture.observe({ id: name, header: { cwd: wikiRoot } }, events[2])
    await capture.whenIdle()
    assert.equal(capture.getCapture(name).phase, 'skipped')
    await capture.dispose()
  }
  assert.deepEqual(requests.map(request => request.authorization), ['Bearer commandcode-file-key', 'Bearer commandcode-env-key'])
  assert.ok(requests.every(request => request.path === '/provider/v1/systemone' && request.model === 'typesafe/jev-1.14.0'))
})

test('Jev records actual verification questions and deferred gates without loosening thresholds',async t=>{
 const server=createServer(async(req,res)=>{
  let raw='';for await(const chunk of req)raw+=chunk
  const body=JSON.parse(raw)
  assert.equal(body.questions.claim_0.type,'choice')
  res.setHeader('content-type','application/json')
  res.end(JSON.stringify({model:body.model,answers:{relationship:{type:'choice',choice:'new',confidence:.99,probabilities:{new:1,supplement:0,duplicate:0,conflict:0,unclear:0}},complete:{type:'noul',noul:.94},outcome_scope:{type:'noul',noul:1},claim_0:{type:'choice',choice:'supported',confidence:1,probabilities:{supported:1,unsupported:0,contradicted:0,unclear:0}}},usage:{input_tokens:null,output_tokens:null}}))
 })
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close())
 const judge=new JevJudge({apiKey:'fixture',model:'typesafe/jev-1.14.0',baseURL:`http://127.0.0.1:${server.address().port}/provider/v1`})
 let request
 const decision=await judge.verify({outcome:'completed'},{claims:[{text:'Bounded observation',evidenceRefs:[2]}],files:[],comparisonPages:[],comparisonIndex:[]},new AbortController().signal,value=>request=value)
 assert.equal(request.questions.find(question=>question.id==='claim_0').text.includes('seq references 2'),true)
 assert.equal(decision.disposition,'deferred')
 assert.equal(decision.audit.gateResults.find(gate=>gate.id==='complete.threshold').passed,false)
 assert.equal(decision.audit.gateResults.find(gate=>gate.id==='complete.threshold').expected,.95)
 assert.equal(decision.audit.answers.length,4)
 assert.deepEqual(decision.audit.usage,{inputTokens:null,outputTokens:null})
 assert.ok(decision.durationMs>=0)
})
