import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'
import { JevJudge } from '../lib/server/capture.js'

test('Jev returns a coding lesson decision using the System One protocol', async t => {
  let request
  const server = createServer(async (req, res) => {
    let raw = ''
    for await (const chunk of req) raw += chunk
    request = { path: req.url, authorization: req.headers.authorization, body: JSON.parse(raw) }
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ model: 'jev-1.14.0', answers: {
      activity: { type: 'choice', choice: 'coding', confidence: .99, probabilities: { coding: .995, non_coding: .003, unclear: .002 } },
      lesson_kind: { type: 'choice', choice: 'failed_approach', confidence: .99, probabilities: { verified_fix: 0, failed_approach: 1, workflow_lesson: 0, none: 0, unclear: 0 } },
      lasting_value: { type: 'noul', noul: .99 }, evidence_sufficient: { type: 'noul', noul: .99 },
    }, usage: { input_tokens: 30, output_tokens: 10 } }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => server.close())
  const judge = new JevJudge({ apiKey: 'test-key', baseURL: `http://127.0.0.1:${server.address().port}`, model: 'jev-1.14.0' })
  const decision = await judge.assess({ requestedTask: 'Fix a failed build', events: [], limitations: [] }, new AbortController().signal)
  assert.equal(request.path, '/v1/systemone')
  assert.equal(request.authorization, 'Bearer test-key')
  assert.equal(request.body.model, 'jev-1.14.0')
  assert.equal(request.body.questions.activity.type, 'choice')
  assert.equal(request.body.questions.lasting_value.type, 'noul')
  assert.equal(decision.disposition, 'prepare')
  assert.equal(decision.model, 'jev-1.14.0')
})
