import { memo, useCallback, useMemo } from 'react'
import { Background, Handle, Position, ReactFlow, type Edge, type Node } from '@xyflow/react'
import type { RetrievalReport } from '../core/types.js'
import { reasonLabel } from './CandidateList.js'

/**
 * 双链图谱：节点=页面，边=链接。边的来源（正文 / related 字段）直接来自
 * RetrievalReport.edges[].source —— 界面不改写语义，只换线型。
 */
type PageNodeData = {
  title: string
  pageId: string
  match: 'direct' | 'linked'
  selected: boolean
  active: boolean
  note: string
}

const PageNode = memo(function PageNode(props: { data: PageNodeData }) {
  const { data } = props
  const className =
    'memory-wiki-panel__node' +
    (data.active ? ' is-active' : '') +
    (data.selected ? '' : ' is-excluded')
  return (
    <div className={className} data-testid="mw-node" data-page-id={data.pageId}>
      <Handle type="target" position={Position.Left} id="in" />
      <strong>{data.title}</strong>
      <small>{data.note}</small>
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  )
})

const NODE_TYPES = { page: PageNode }

export function EvidenceGraph(props: {
  report: RetrievalReport
  activePageId: string | null
  onSelect(pageId: string): void
  /**
   * B8: the effective selection (server draft ∪ local picks).
   *
   * The core writes `selected: false` for every candidate on purpose, so a
   * graph that reads `candidate.selected` would always paint "未选入". When this
   * prop is absent (fixture view) the candidate flag is still the authority.
   */
  selectedPageIds?: readonly string[]
}) {
  const { report, activePageId, onSelect, selectedPageIds } = props

  const chosen = useMemo<ReadonlySet<string>>(
    () =>
      selectedPageIds !== undefined
        ? new Set(selectedPageIds)
        : new Set(report.candidates.filter((candidate) => candidate.selected).map((candidate) => candidate.pageId)),
    [report, selectedPageIds],
  )

  const nodes = useMemo<Node[]>(() => {
    const direct = report.candidates.filter((candidate) => candidate.match === 'direct')
    const linked = report.candidates.filter((candidate) => candidate.match === 'linked')
    const build = (candidate: (typeof report.candidates)[number], index: number, column: number): Node => ({
      id: candidate.pageId,
      type: 'page',
      position: { x: 30 + column * 250, y: 20 + index * 96 },
      data: {
        title: candidate.title,
        pageId: candidate.pageId,
        match: candidate.match,
        selected: chosen.has(candidate.pageId),
        active: candidate.pageId === activePageId,
        note:
          candidate.match === 'direct'
            ? '直接命中 #' + candidate.rank + ' · ' + (chosen.has(candidate.pageId) ? '已选入' : '未选入')
            : '关联 · ' +
              (chosen.has(candidate.pageId) ? '已选入' : reasonLabel(candidate.excludedReason) ?? '未选入'),
      } satisfies PageNodeData,
    })
    return [
      ...direct.map((candidate, index) => build(candidate, index, 0)),
      ...linked.map((candidate, index) => build(candidate, index, 1)),
    ]
  }, [report, activePageId, chosen])

  const edges = useMemo<Edge[]>(() => {
    const known = new Set(report.candidates.map((candidate) => candidate.pageId))
    const selected = chosen
    return report.edges
      .filter((edge) => known.has(edge.from) && known.has(edge.to))
      .map((edge) => {
        const body = edge.source === 'body'
        const live = selected.has(edge.from) && selected.has(edge.to)
        const color = body ? '#8bc7f4' : '#6e86a2'
        return {
          id: edge.source + ':' + edge.from + '>' + edge.to,
          source: edge.from,
          target: edge.to,
          sourceHandle: 'out',
          targetHandle: 'in',
          type: 'default',
          // No inline label: at this density the midpoint label lands on top of
          // nodes. The legend below the graph names both kinds, and the line
          // style (solid vs dashed) is verifiable from computed styles.
          style: {
            stroke: color,
            strokeWidth: body ? 1.8 : 1.5,
            strokeDasharray: body ? undefined : '6 5',
            opacity: live ? 1 : 0.6,
          },
          markerEnd: { type: 'arrowclosed' as never, width: 14, height: 14, color },
        } as Edge
      })
  }, [report, chosen])

  const onNodeClick = useCallback(
    (_event: unknown, node: Node) => {
      if (typeof node.id === 'string') onSelect(node.id)
    },
    [onSelect],
  )

  return (
    <div className="memory-wiki-panel__graph-wrap">
      <div className="memory-wiki-panel__section-head">
        <span>双链图谱</span>
        <span data-testid="mw-graph-facts">
          {nodes.length} 节点 / {edges.length} 边
        </span>
      </div>
      <div className="memory-wiki-panel__graph" data-testid="mw-graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.16, maxZoom: 1 }}
          minZoom={0.4}
          maxZoom={1.2}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
      <div className="memory-wiki-panel__legend" data-testid="mw-legend">
        <span>
          <i />
          正文链接（body）
        </span>
        <span>
          <i className="is-related" />
          related 字段
        </span>
        <span>虚线节点 = 未选入候选</span>
      </div>
    </div>
  )
}
