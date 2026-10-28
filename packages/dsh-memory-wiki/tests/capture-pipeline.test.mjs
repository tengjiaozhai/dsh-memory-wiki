import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { ExperienceCapture as CaptureWorker, CaptureJournal, JudgeBudgetExceeded } from '../lib/server/capture.js'

// Controlled judges use the same recorded-call seam as the production transport.
class ExperienceCapture extends CaptureWorker {
  constructor(options) {
    const judge = Object.fromEntries(Object.entries(options.judge).map(([method, call]) => [method, async (...args) => {
      args.at(-1)({ model: 'fixture-judge', requestHash: 'fixture-request', questions: [] })
      const result = await call(...args)
      return { ...result, audit: { kind: 'decision', answers: [], gateResults: [], disposition: result.disposition, reasonCode: 'fixture', reason: result.reason } }
    }]))
    super({ ...options, judge })
  }
}

test('a completed human turn is frozen once, survives restart, and does not capture injected turns', async t => {
  const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-jobs-'))
  t.after(() => fs.rm(dataRoot, { recursive: true, force: true }))
  let assessed = 0
  const events = [
    { seq: 0, type: 'turn/start', data: { turn: 1 } },
    { seq: 1, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'Just format this file' }] } },
    { seq: 2, type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } },
  ]
  const session = { id: 'human-session', header: { cwd: '/fixture' }, snapshotEvents: () => events, requestHeader: () => ({ config: { provider: 'fixture', model: 'writer' } }) }
  const options = { wikiRoot: dataRoot, dataRoot: path.join(dataRoot, 'jobs'), judge: {
    assess: async evidence => { assessed++; assert.equal(evidence.origin.turnStartSeq, 0); return { disposition: 'skipped', reason: 'routine formatting', model: 'typesafe/jev-1.14.0' } },
    verify: async () => { throw new Error('No writer should run for skipped work') },
  }, ingest: {}, readEvents: async () => events }
  const capture = new ExperienceCapture(options)
  capture.observe(session, events[2])
  capture.observe(session, events[2])
  await capture.whenIdle()
  assert.equal(capture.getCapture(session.id).phase, 'skipped')
  assert.equal(assessed, 1)
  const journal = new CaptureJournal(options.dataRoot)
  const item = journal.list({ sessionId: session.id }).items[0]
  const record = journal.record({ sessionId: session.id, jobId: item.jobId })
  assert.equal(record.judgments[0].state, 'completed')
  assert.equal(journal.judgment({ sessionId: session.id, jobId: item.jobId, judgmentId: record.judgments[0].id }).judgment.result.disposition, 'skipped')
  await capture.dispose()
  const resumed = new ExperienceCapture(options)
  await resumed.recover()
  await resumed.whenIdle()
  resumed.observe(session, events[2])
  await resumed.whenIdle()
  assert.equal(assessed, 1)
  assert.equal(resumed.getCapture(session.id).phase, 'skipped')
  await resumed.dispose()
})

test('injected context and subagent completions do not create new learning tasks', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-no-recursion-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const events = [{ seq: 0, type: 'turn/start', data: { turn: 1 } }, { seq: 1, type: 'user/message', data: { source: { kind: 'memory-wiki' }, content: [{ type: 'text', text: 'Previously retrieved knowledge' }] } }, { seq: 2, type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }]
  const capture = new ExperienceCapture({ wikiRoot: root, dataRoot: path.join(root, 'jobs'), judge: { assess: async () => { assert.fail('Synthetic context must not be judged') } }, ingest: {}, readEvents: async () => events })
  capture.observe({ id: 'injected', header: {} }, events[2])
  capture.observe({ id: 'subagent', header: { origin: 'subagent' } }, events[2])
  await capture.whenIdle()
  assert.equal(capture.getCapture('injected'), undefined)
  assert.equal(capture.getCapture('subagent'), undefined)
  await capture.dispose()
})

test('Jev failure is visible, never writes, and leaves later human turns usable', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-failure-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const events = [{ seq: 0, type: 'turn/start', data: { turn: 1 } }, { seq: 1, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'Fix build' }] } }, { seq: 2, type: 'turn/end', data: { turn: 1, reason: { kind: 'error' } } }]
  let attempts = 0
  const capture = new ExperienceCapture({ wikiRoot: root, dataRoot: path.join(root, 'jobs'), judge: { assess: async evidence => {
    attempts++
    if (attempts === 1) { assert.equal(evidence.outcome, 'error'); throw new Error('Typesafe HTTP 451') }
    return { disposition: 'skipped', reason: 'Routine', model: 'typesafe/jev-1.14.0' }
  } }, ingest: {}, readEvents: async () => events })
  const session = { id: 'human', header: {}, requestHeader: () => ({ config: { provider: 'test', model: 'test' } }) }
  capture.observe(session, events[2])
  await capture.whenIdle()
  assert.equal(capture.getCapture('human').phase, 'failed')
  assert.match(capture.getCapture('human').reason, /451/)
  events.push({ seq: 3, type: 'turn/start', data: { turn: 2 } }, { seq: 4, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'Second task' }] } }, { seq: 5, type: 'turn/end', data: { turn: 2, reason: { kind: 'completed' } } })
  capture.observe(session, events[5])
  await capture.whenIdle()
  assert.equal(capture.getCapture('human').phase, 'skipped')
  assert.equal(attempts, 2)
  await capture.dispose()
})

test('structured credentials are removed before either model receives the evidence', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-redaction-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const providerKey = 'user_' + 'X'.repeat(88)
  const events = [{ seq: 0, type: 'turn/start', data: { turn: 1 } }, { seq: 1, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'Debug with {"password":"not-for-the-model"} ' + providerKey }], credentials: { arbitrary: 'nested-credential' } } }, { seq: 2, type: 'tool/result', data: { path: '/fixture/auth.json', text: 'do-not-send-auth-file' } }, { seq: 3, type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }]
  const capture = new ExperienceCapture({ wikiRoot: root, dataRoot: path.join(root, 'jobs'), judge: { assess: async evidence => {
    const data = JSON.stringify(evidence)
    for (const privateValue of [providerKey, 'not-for-the-model', 'nested-credential', 'do-not-send-auth-file', '/private/customer-project']) assert.equal(data.includes(privateValue), false)
    return { disposition: 'deferred', reason: 'Sensitive evidence omitted', model: 'typesafe/jev-1.14.0' }
  } }, ingest: {}, readEvents: async () => events })
  capture.observe({ id: 'human', header: { cwd: '/private/customer-project' } }, events[3])
  await capture.whenIdle()
  assert.equal(capture.getCapture('human').phase, 'deferred')
  assert.match(capture.getCapture('human').limitations.join(','), /凭据/)
  await capture.dispose()
})

test('the next successful log read catches up a previously unread completed turn', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-catchup-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const events = [1, 2].flatMap((turn, index) => [{ seq: index * 3, type: 'turn/start', data: { turn } }, { seq: index * 3 + 1, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: `Task ${turn}` }] } }, { seq: index * 3 + 2, type: 'turn/end', data: { turn, reason: { kind: 'completed' } } }])
  const turns = []
  let reads = 0
  const capture = new ExperienceCapture({ wikiRoot: root, dataRoot: path.join(root, 'jobs'), judge: { assess: async evidence => { turns.push(evidence.origin.turn); return { disposition: 'skipped', reason: 'routine', model: 'typesafe/jev-1.14.0' } } }, ingest: {}, readEvents: async () => { if (++reads === 1) throw new Error('Temporary read failure'); return events } })
  const session = { id: 'human', header: {} }
  capture.observe(session, events[2])
  await capture.whenIdle()
  capture.observe(session, events[5])
  await capture.whenIdle()
  assert.deepEqual(turns, [1, 2])
  await capture.dispose()
})

test('a partially published approved job resumes after restart without re-generating its text', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-resume-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const events = [{ seq: 0, type: 'turn/start', data: { turn: 1 } }, { seq: 1, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'Diagnose retry' }] } }, { seq: 2, type: 'request/header', data: { header: { config: { provider: 'original', model: 'writer' } } } }, { seq: 3, type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }]
  let generations = 0
  let publications = 0
  const options = { wikiRoot: root, dataRoot: path.join(root, 'jobs'), readEvents: async () => events,
    judge: { assess: async () => ({ disposition: 'prepare', reason: 'supported', model: 'typesafe/jev-1.14.0' }), verify: async () => ({ disposition: 'publish', reason: 'supported', model: 'typesafe/jev-1.14.0' }) },
    ingest: { prepare: async () => { generations++; return { patchHash: 'approved-exact-text', rulesHash: 'fixture-rules', files: [] } }, publish: async manifest => {
      assert.equal(manifest.patchHash, 'approved-exact-text')
      if (++publications === 1) throw Object.assign(new Error('Temporary filesystem I/O error'), { code: 'EIO' })
      return ['wiki/synthesis/retry']
    } },
  }
  const first = new ExperienceCapture(options)
  first.observe({ id: 'human', header: {} }, events[3])
  await first.whenIdle()
  assert.equal(first.getCapture('human').phase, 'failed')
  const pending = new CaptureJournal(options.dataRoot).list({ sessionId: 'human' }).items[0]
  assert.equal(pending.publicationUncertain, true)
  assert.equal(pending.retryable, true)
  await first.dispose()
  const resumed = new ExperienceCapture(options)
  await resumed.recover()
  await resumed.whenIdle()
  assert.equal(resumed.getCapture('human').phase, 'ingested')
  assert.equal(new CaptureJournal(options.dataRoot).list({ sessionId: 'human' }).items[0].publicationUncertain, undefined)
  assert.equal(generations, 1)
  assert.equal(publications, 2)
  await resumed.dispose()
})

test('journal failure before a request prevents the model call and remains visible without rewriting the job',async t=>{
  const sync=await import('node:fs')
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'capture-write-failure-'))
  t.after(()=>fs.rm(root,{recursive:true,force:true}))
  const events=[{seq:0,type:'turn/start',data:{turn:1}},{seq:1,type:'user/message',data:{source:{kind:'user'},content:[{type:'text',text:'Fix build'}]}},{seq:2,type:'turn/end',data:{turn:1,reason:{kind:'completed'}}}]
  let calls=0
  const capture=new CaptureWorker({wikiRoot:root,dataRoot:path.join(root,'jobs'),readEvents:async()=>events,judge:{assess:async(evidence,signal,started)=>{started({model:'fixture',requestHash:'request',questions:[]});calls++;throw Error('must not reach')},verify:async()=>assert.fail()},ingest:{}})
  const rename=sync.default.renameSync
  const fault=t.mock.method(sync.default,'renameSync',(source,target)=>{
    if(String(target).endsWith('.json') && !String(target).includes('/watched/') && sync.default.readFileSync(source,'utf8').includes('judgment_started'))throw Object.assign(Error('EIO'),{code:'EIO'})
    return rename(source,target)
  })
  capture.observe({id:'human',header:{}},events[2])
  await capture.whenIdle()
  fault.mock.restore()
  assert.equal(calls,0)
  assert.equal(capture.blocked,true)
  assert.equal(capture.getIssue('human').stage,'journal_write')
  const journal=new CaptureJournal(path.join(root,'jobs'))
  const item=journal.list({sessionId:'human'}).items[0]
  assert.equal(item.phase,'judging')
  assert.equal(item.judgments.length,0)
  await capture.dispose()
})

test('a mismatched watched-session identity blocks recovery without reading any session',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'capture-watched-invalid-'))
 t.after(()=>fs.rm(root,{recursive:true,force:true}))
 await fs.mkdir(path.join(root,'jobs/watched'),{recursive:true})
 await fs.writeFile(path.join(root,'jobs/watched','a'.repeat(64)+'.json'),JSON.stringify({sessionId:'foreign-session',workspace:'/fixture',cursor:0}))
 let reads=0
 const capture=new CaptureWorker({wikiRoot:root,dataRoot:path.join(root,'jobs'),judge:{},ingest:{},readEvents:async()=>{reads++;return[]}})
 await capture.recover()
 assert.equal(reads,0)
 assert.equal(capture.blocked,true)
 await capture.dispose()
})

test('common provider environment credential names are redacted before persistence and history projection',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'capture-env-redaction-'))
 t.after(()=>fs.rm(root,{recursive:true,force:true}))
 const events=[{seq:0,type:'turn/start',data:{turn:1}},{seq:1,type:'user/message',data:{source:{kind:'user'},content:[{type:'text',text:'OPENAI_API_KEY=example-secret-key GITHUB_TOKEN=private-github-value'}],OPENAI_API_KEY:'structured-secret',GITHUB_TOKEN:'structured-token'}},{seq:2,type:'turn/end',data:{turn:1,reason:{kind:'completed'}}}]
 const capture=new ExperienceCapture({wikiRoot:root,dataRoot:path.join(root,'jobs'),readEvents:async()=>events,ingest:{},judge:{assess:async evidence=>{
  for(const secret of ['example-secret-key','private-github-value','structured-secret','structured-token'])assert.equal(JSON.stringify(evidence).includes(secret),false)
  return{disposition:'skipped',reason:'routine',model:'fixture'}
 }}})
 capture.observe({id:'human',header:{}},events[2]);await capture.whenIdle()
 for(const file of (await fs.readdir(path.join(root,'jobs'))).filter(file=>file.endsWith('.json'))){const content=await fs.readFile(path.join(root,'jobs',file),'utf8');assert.equal(content.includes('private-github-value'),false)}
 await capture.dispose()
})

test('a large turn now reaches the judge instead of being discarded as capacity',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'capture-large-'))
 t.after(()=>fs.rm(root,{recursive:true,force:true}))
 const events=[{seq:0,type:'turn/start',data:{turn:1}},{seq:1,type:'user/message',data:{source:{kind:'user'},content:[{type:'text',text:'Summarize the long build log'}]}},
  ...Array.from({length:30},(_,index)=>({seq:index+2,type:'assistant/message',data:{message:{content:[{type:'text',text:'x'.repeat(2_500)}]}}})),
  {seq:32,type:'turn/end',data:{turn:1,reason:{kind:'completed'}}}]
 let judged=0
 const capture=new ExperienceCapture({wikiRoot:root,dataRoot:path.join(root,'jobs'),judge:{
  assess:async()=>{judged++;return{disposition:'deferred',reason:'经验价值不足',model:'fixture'}},
  verify:async()=>{assert.fail('No verify for a deferred assessment')},
 },ingest:{},readEvents:async()=>events})
 capture.observe({id:'human',header:{},requestHeader:()=>({config:{provider:'p',model:'m'}})},events.at(-1))
 await capture.whenIdle()
 const view=capture.getCapture('human')
 assert.equal(judged,1,'the judge must see a large turn')
 assert.equal(view.phase,'deferred')
 assert.match(view.reason,/经验价值不足/)
 await capture.dispose()
})

test('evidence that cannot be folded is deferred as capacity, never failed',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'capture-unfoldable-'))
 t.after(()=>fs.rm(root,{recursive:true,force:true}))
 // user/message is a fixed kind: folding cannot shrink it, so the request guard fires.
 const events=[{seq:0,type:'turn/start',data:{turn:1}},
  ...Array.from({length:35},(_,index)=>({seq:index+1,type:'user/message',data:{source:{kind:'user'},content:[{type:'text',text:'x'.repeat(2_500)}]}})),
  {seq:36,type:'turn/end',data:{turn:1,reason:{kind:'completed'}}}]
 const capture=new ExperienceCapture({wikiRoot:root,dataRoot:path.join(root,'jobs'),judge:{
  assess:async()=>{throw new JudgeBudgetExceeded(90_000,72_000)},
  verify:async()=>{assert.fail('No verify for an over-budget turn')},
 },ingest:{},readEvents:async()=>events})
 capture.observe({id:'human',header:{},requestHeader:()=>({config:{provider:'p',model:'m'}})},events.at(-1))
 await capture.whenIdle()
 const view=capture.getCapture('human')
 assert.equal(view.phase,'deferred')
 assert.match(view.reason,/上下文预算/)
 // No assertion on the judgment record count: the production guard throws before
 // `started`, so the journal shape is an implementation detail of the transport.
 await capture.dispose()
})
