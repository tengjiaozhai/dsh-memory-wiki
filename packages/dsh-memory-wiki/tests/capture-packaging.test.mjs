import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import ts from 'typescript'

test('the browser client only requires modules seeded by the DSH loader', () => {
  const client = path.join(import.meta.dirname, '../lib/client.js')
  const source = ts.createSourceFile(client, fs.readFileSync(client, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  // DSH rc.3 resolves classic-script requires through its platform module table,
  // not Node resolution. Browser dependencies must travel inside this one file.
  const platform = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client', 'zod'])
  const imports = []
  function visit(node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require') {
      assert.equal(node.arguments.length, 1, 'the host loader requires a single module id')
      assert.equal(ts.isStringLiteral(node.arguments[0]), true, 'the host loader cannot resolve dynamic module ids')
      imports.push(node.arguments[0].text)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  assert.ok(imports.length > 0, 'exercise the built client and its actual external imports')
  assert.deepEqual(imports.filter(id => !platform.has(id)), [], 'dsh-memory-wiki: import failed: module missing from the host table')
})

test('the published shared contract has a real declaration for external clients', () => {
  const root = path.join(import.meta.dirname, '..')
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const declaration = path.join(root, manifest.exports['./contracts'].types)
  assert.equal(fs.existsSync(declaration), true, 'the declared types export must exist in the package')
  const consumer = path.join(root, 'capture-contract-consumer.ts')
  const content = `import type { CaptureView, SessionView } from 'dsh-memory-wiki/contracts';
    declare const view: SessionView;
    const capture: CaptureView | undefined = view.capture;
    if (capture) { const pages: string[] = capture.pages; const reason: string = capture.reason; }
  `
  const options = { module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, target: ts.ScriptTarget.ES2022, strict: true, skipLibCheck: true, noEmit: true, types: [] }
  const host = ts.createCompilerHost(options)
  const readSource = host.getSourceFile.bind(host)
  host.getSourceFile = (file, languageVersion, onError, fresh) => file === consumer ? ts.createSourceFile(file, content, languageVersion) : readSource(file, languageVersion, onError, fresh)
  const program = ts.createProgram([consumer], options, host)
  assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')), [])
})
