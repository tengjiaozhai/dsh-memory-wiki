import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { Handle, Position, ReactFlow, ReactFlowProvider, useReactFlow, useViewport, type Node, type NodeProps, type Edge } from '@xyflow/react'
import type { GraphResult } from '../shared/contracts.js'
import { layoutGraph } from './graph-layout.js'
import { Icon } from './icons.js'

type PageNode = Node<{ title: string; active: boolean; dim: boolean; degree: number; match: boolean; label: boolean; scale: number }, 'page'>
const PagePoint = memo(function PagePoint({ data, id }: NodeProps<PageNode>) {
  return (
    <button type="button" className={'memory-wiki-panel__point' + (data.active ? ' is-active' : '') + (data.dim ? ' is-dim' : '') + (data.match ? ' is-match' : '')}
      data-testid="mw-node" data-page-id={id} data-show-label={data.label ? '1' : '0'} title={data.title} aria-label={'查看 ' + data.title} aria-pressed={data.active}>
      <Handle type="target" position={Position.Top} id="in" />
      <i style={{ width: Math.min(16, 8 + Math.sqrt(data.degree) * 2), height: Math.min(16, 8 + Math.sqrt(data.degree) * 2) }} />
      <span style={{ fontSize: 13 * data.scale, width: 180 * data.scale }}>{data.title}</span>
      <Handle type="source" position={Position.Top} id="out" />
    </button>
  )
})
const NODE_TYPES = { page: PagePoint }

type Props = { graph: GraphResult; activePageId: string | null; onSelect(pageId: string): void; matches: ReadonlySet<string>; drawer: boolean; reset: number }

function Canvas({ graph, activePageId, onSelect, matches, drawer, reset }: Props) {
  const flow = useReactFlow<PageNode>()
  const root = useRef<HTMLDivElement>(null)
  const { zoom } = useViewport()
  const positions = useMemo(() => layoutGraph(graph.pages, graph.edges), [graph])
  const neighborhood = useMemo(() => {
    const connected = new Set([activePageId])
    for (const edge of graph.edges) {
      if (edge.from === activePageId) connected.add(edge.to)
      if (edge.to === activePageId) connected.add(edge.from)
    }
    return connected
  }, [graph, activePageId])
  const degree = useMemo(() => {
    const map = new Map<string, number>()
    for (const edge of graph.edges) for (const id of [edge.from, edge.to]) map.set(id, (map.get(id) ?? 0) + 1)
    return map
  }, [graph])
  // Greedily reserve room for readable labels, prioritizing selection and search.
  const labels = useMemo(() => {
    const visible = new Set<string>()
    const boxes: Array<{ x: number; y: number }> = []
    const priority = (id: string) => id === activePageId ? 100000 : matches.has(id) ? 10000 : neighborhood.has(id) ? 1000 : 0
    const order = [...graph.pages].sort((a, b) => priority(b.pageId) + (degree.get(b.pageId) ?? 0) - priority(a.pageId) - (degree.get(a.pageId) ?? 0))
    for (const page of order) {
      const point = positions.get(page.pageId)!
      const force = page.pageId === activePageId || matches.has(page.pageId)
      if (force || !boxes.some((box) => Math.abs(box.x - point.x) * zoom < 195 && Math.abs(box.y - point.y) * zoom < 46)) {
        visible.add(page.pageId)
        boxes.push(point)
      }
    }
    return visible
  }, [graph, positions, zoom, activePageId, matches, neighborhood, degree])
  const nodes = useMemo<PageNode[]>(() => graph.pages.map((page) => ({
    id: page.pageId, type: 'page', position: positions.get(page.pageId)!,
    data: { title: page.title, active: page.pageId === activePageId, dim: activePageId !== null && !neighborhood.has(page.pageId), degree: degree.get(page.pageId) ?? 0, match: matches.has(page.pageId), label: labels.has(page.pageId), scale: 1 / Math.max(0.08, zoom) },
  })), [graph, positions, activePageId, neighborhood, degree, matches, labels, zoom])
  const edges = useMemo<Edge[]>(() => graph.edges.map((edge, i) => {
    const highlighted = activePageId !== null && (edge.from === activePageId || edge.to === activePageId)
    return { id: String(i), source: edge.from, target: edge.to, sourceHandle: 'out', targetHandle: 'in', type: 'default',
      style: { stroke: highlighted ? 'var(--mw-blue)' : 'var(--mw-edge)', strokeWidth: highlighted ? 1.5 : 1, opacity: activePageId === null ? 0.3 : highlighted ? 0.95 : 0.12, strokeDasharray: edge.source === 'related' ? '4 5' : undefined },
    }
  }), [graph, activePageId])
  const fit = useCallback(() => { void flow.fitView({ padding: 0.2, maxZoom: 1, duration: 200 }) }, [flow])
  useEffect(() => { fit() }, [positions, reset, fit])
  useEffect(() => {
    if (activePageId === null) return
    const point = positions.get(activePageId), element = root.current
    if (point === undefined || element === null || element.clientWidth < 700) return
    const zoom = Math.max(0.85, Math.min(1.2, flow.getZoom()))
    const available = element.clientWidth - (drawer ? Math.min(420, element.clientWidth * 0.4) + 32 : 0)
    void flow.setViewport({ x: available / 2 - (point.x + 80) * zoom, y: element.clientHeight / 2 - (point.y + 18) * zoom, zoom }, { duration: 200 })
  }, [activePageId, drawer, flow, positions])
  return (
    <div ref={root} className="memory-wiki-panel__graph" data-testid="mw-graph">
      <ReactFlow<PageNode> nodes={nodes} edges={edges} nodeTypes={NODE_TYPES}
        onNodeClick={(_event, node) => onSelect(node.id)} fitView fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={0.08} maxZoom={1.8} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false}
        elementsSelectable panOnDrag zoomOnScroll zoomOnDoubleClick={false} />
      <div className="memory-wiki-panel__canvas-tools" aria-label="图谱视图">
        <span data-testid="mw-graph-facts">{graph.pages.length} 页 · {graph.edges.length} 条连接</span>
        <button type="button" aria-label="缩小" onClick={() => void flow.zoomOut({ duration: 150 })}><Icon name="minus" /></button>
        <button type="button" aria-label="放大" onClick={() => void flow.zoomIn({ duration: 150 })}><Icon name="plus" /></button>
        <button type="button" aria-label="显示完整图谱" onClick={fit}><Icon name="fit" /></button>
      </div>
      <div className="memory-wiki-panel__graph-legend" data-testid="mw-legend"><span>实线 · 正文链接</span><span>虚线 · related</span></div>
    </div>
  )
}

export function EvidenceGraph(props: Props) {
  return <ReactFlowProvider><Canvas {...props} /></ReactFlowProvider>
}
