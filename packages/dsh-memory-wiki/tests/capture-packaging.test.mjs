import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import ts from 'typescript'

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
