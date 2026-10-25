import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

// Execute the actual component effect. The only simulated browser behavior is
// Sigma.kill() asynchronously losing its old WebGL context, as Sigma 3 does.
function harness() {
  const effects = []
  const state = []
  const refs = []
  const instances = []
  let stateIndex = 0
  let refIndex = 0
  const element = { appendChild() {} }
  const hooks = {
    useRef(initial) { const index = refIndex++; return refs[index] ??= { current: index === 0 ? element : initial } },
    useState(initial) { const index = stateIndex++; if (!(index in state)) state[index] = initial; return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value }] },
    useMemo(factory) { return factory() },
    useEffect(effect) { effects.push(effect) },
  }
  const camera = { removeAllListeners() {}, on() {} }
  class Sigma {
    constructor() { this.canvas = new EventTarget(); instances.push(this) }
    getCamera() { return camera }
    getCanvases() { return { nodes: this.canvas } }
    on() {}
    resize() {}
    kill() { queueMicrotask(() => this.canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))) }
  }
  const dependencies = {
    react: hooks,
    'react/jsx-runtime': { jsx(type, props) { return typeof type === 'function' ? type(props) : null }, jsxs() {} },
    sigma: { default: Sigma },
    '@sigma/edge-curve': { createEdgeCurveProgram() {}, indexParallelEdgesIndex() {} },
    'sigma/rendering': { drawDiscNodeLabel() {} },
    './graph-layout.js': { layoutGraph(graph) { return { graph } }, graphStructure() { return {} } },
    './graph-style.js': { applyGraphEmphasis() {}, applyParallelCurvatures() {} },
    './icons.js': { Icon() {} },
  }
  const file = new URL('../src/client/EvidenceGraph.tsx', import.meta.url)
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  })
  const exports = {}
  vm.runInNewContext(outputText, {
    exports,
    require(id) { assert.ok(id in dependencies, id); return dependencies[id] },
    document: { createElement() { return { className: '', remove() {}, replaceChildren() {} } } },
    window: { matchMedia() { return { matches: true } } },
    ResizeObserver: class { observe() {} disconnect() {} },
    cancelAnimationFrame() {}, console,
  }, { filename: file.pathname })
  function render() {
    effects.length = 0
    stateIndex = 0
    refIndex = 0
    exports.EvidenceGraph({ graph: { pages: [], edges: [] }, activePageId: null, onSelect() {}, matches: new Set(), drawer: false, reset: 0 })
    return effects[0]()
  }
  return { render, instances, failed: () => state[1] }
}

test('refresh: disposing the old renderer cannot mark its replacement as WebGL unavailable', async () => {
  const graph = harness()
  const dispose = graph.render()
  assert.equal(graph.failed(), false)
  dispose()
  const disposeNext = graph.render()
  await new Promise(resolve => queueMicrotask(resolve))
  assert.equal(graph.instances.length, 2)
  assert.equal(graph.failed(), false, 'a disposed canvas must not cover the new graph with a WebGL error')
  disposeNext()
})

test('active context loss remains visible and restoration creates a working renderer', async () => {
  const graph = harness()
  const dispose = graph.render()
  graph.instances[0].canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))
  assert.equal(graph.failed(), true)
  graph.instances[0].canvas.dispatchEvent(new Event('webglcontextrestored'))
  await new Promise(resolve => queueMicrotask(resolve))
  assert.equal(graph.instances.length, 2)
  assert.equal(graph.failed(), false, 'restoration must not be invalidated by the replaced renderer')
  dispose()
})
