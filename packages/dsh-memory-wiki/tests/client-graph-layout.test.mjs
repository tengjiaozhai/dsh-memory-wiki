import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stripTypeScriptTypes } from 'node:module'

const here = path.dirname(fileURLToPath(import.meta.url))
const input = path.join(here, '..', 'src', 'client', 'graph-layout.ts')
const output = path.join(here, '.build', 'client-graph', 'graph-layout.js')
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, stripTypeScriptTypes(fs.readFileSync(input, 'utf8'), { mode: 'strip' }))
fs.writeFileSync(path.join(here, '.build', 'client-graph', 'graph-style.js'), stripTypeScriptTypes(fs.readFileSync(path.join(here, '..', 'src', 'client', 'graph-style.ts'), 'utf8'), { mode: 'strip' }))
const { layoutGraph, graphStructure } = await import('./.build/client-graph/graph-layout.js')
const { applyParallelCurvatures, applyGraphEmphasis } = await import('./.build/client-graph/graph-style.js')

const page = (pageId, title = pageId) => ({ pageId, title, kind: 'concept', contentHash: 'hash-' + pageId })
const leaves = Array.from({ length: 12 }, (_, index) => page('leaf' + index))
// 每对节点在语料里都被记了三次：hub 正文引用、叶子反向 related、hub 再次正文引用。
// 画布是同一对节点之间的一条线，所以这三种记录只能画成一条。
const result = {
  libraryRevision: 'layout-fixture',
  pages: [page('hub'), page('isolated'), ...leaves],
  edges: [
    ...leaves.flatMap((leaf) => [
      { from: 'hub', to: leaf.pageId, source: 'body' },
      { from: leaf.pageId, to: 'hub', source: 'related' },
      { from: 'hub', to: leaf.pageId, source: 'body' },
    ]),
    { from: 'leaf0', to: 'leaf1', source: 'related' },
  ],
  brokenLinks: 0,
}
const pairCount = 13
const edgesBetween = (layout, a, b) => layout.graph.edges().filter((id) => {
  const source = layout.graph.source(id)
  const target = layout.graph.target(id)
  return (source === a && target === b) || (source === b && target === a)
})

test('图谱布局：同一对节点只保留一条线，孤立页也有有限坐标', () => {
  const layout = layoutGraph(result)
  assert.equal(layout.graph.order, result.pages.length)
  assert.equal(layout.graph.size, pairCount)
  assert.equal(edgesBetween(layout, 'hub', 'leaf0').length, 1)
  assert.equal(edgesBetween(layout, 'hub', 'leaf5').length, 1)
  assert.equal(graphStructure(result).links.length, pairCount)
  assert.equal(layout.nodes.get('isolated').degree, 0)
  for (const [id, node] of layout.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y), id + ' has a finite position')
    assert.ok(Number.isFinite(node.size) && node.size > 0)
  }
})

test('图谱布局：连接度按节点对计算，确定性、层级和曲线路径不变', () => {
  const first = layoutGraph(result)
  const second = layoutGraph(result)
  assert.deepEqual([...first.nodes].map(([id, node]) => [id, node.x, node.y]), [...second.nodes].map(([id, node]) => [id, node.x, node.y]))
  assert.equal(graphStructure(result).degree.get('hub'), 12)
  assert.equal(first.nodes.get('leaf0').degree, 2)
  assert.ok(first.hubs.has('hub'))
  assert.ok(!first.hubs.has('leaf0'))
  assert.ok(first.nodes.get('hub').size > first.nodes.get('leaf0').size)
  assert.ok(first.nodes.get('hub').labelSize > first.nodes.get('leaf0').labelSize)
  const related = first.graph.edges().filter(id => first.graph.getEdgeAttribute(id, 'source') === 'related')
  assert.equal(related.length, 1)
  assert.equal(first.graph.getEdgeAttribute(related[0], 'path'), 'curved')
})

test('图谱交互：同一路径上的重复边不叠加曲率，选中淡化', async () => {
  const layout = layoutGraph(result)
  applyParallelCurvatures(layout)
  const indices = [-0.5, 0.5]
  layout.graph.setEdgeAttribute(layout.graph.edges()[0], 'parallelIndex', indices[0])
  layout.graph.setEdgeAttribute(layout.graph.edges()[1], 'parallelIndex', indices[1])
  applyParallelCurvatures(layout)
  assert.equal(layout.graph.getEdgeAttribute(layout.graph.edges()[0], 'curvature'), 0.03)
  assert.equal(layout.graph.getEdgeAttribute(layout.graph.edges()[1], 'curvature'), 0.21)
  const settings = {}
  const instance = { setSetting(name, value) { settings[name] = value }, refresh() { this.refreshed = true } }
  applyGraphEmphasis(instance, layout, graphStructure(result), 'hub', new Set())
  assert.equal(settings.nodeReducer('isolated', {}).color, 'rgba(130,154,178,0.24)')
  assert.equal(settings.nodeReducer('isolated', {}).labelColor, 'rgba(194,207,221,0.2)')
  assert.equal(settings.nodeReducer('isolated', {}).forceLabel, false)
  const touching = layout.graph.edges().find(id => layout.graph.source(id) === 'hub' || layout.graph.target(id) === 'hub')
  assert.equal(settings.edgeReducer(touching, {}).color, '#8bc7f4')
  const isolatedPage = page('lonely')
  const withLonely = { ...result, pages: [...result.pages, isolatedPage], edges: [...result.edges, { from: 'leaf0', to: 'lonely', source: 'body' }] }
  const lonelyLayout = layoutGraph(withLonely)
  applyGraphEmphasis(instance, lonelyLayout, graphStructure(withLonely), 'hub', new Set())
  const dimmed = lonelyLayout.graph.edges().find(id => lonelyLayout.graph.source(id) === 'leaf0' && lonelyLayout.graph.target(id) === 'lonely')
  assert.equal(settings.edgeReducer(dimmed, {}).color, 'rgba(46,64,83,0.14)')
  assert.equal(instance.refreshed, true)
})

test('图谱构建：不再包含 React Flow 的逐帧反向缩放与旧样式', () => {
  const component = fs.readFileSync(path.join(here, '..', 'src', 'client', 'EvidenceGraph.tsx'), 'utf8')
  assert.ok(!component.includes('@xyflow/react'))
  assert.ok(!component.includes('1 / Math.max'))
  assert.ok(!component.includes('useViewport'))
  assert.ok(component.includes('hideLabelsOnMove: false'))
  assert.ok(component.includes("itemSizesReference: 'screen'"))
  assert.ok(component.includes('new ResizeObserver'))
  assert.ok(component.includes('webglcontextlost'))
})
