import type { GraphLayout, graphStructure } from './graph-layout.js'

type Structure = ReturnType<typeof graphStructure>
type StyleState = { color?: string; labelColor?: string; size?: number; forceLabel?: boolean; zIndex?: number }
export interface GraphStyleTarget {
  setSetting(name: 'nodeReducer' | 'edgeReducer', reducer: (id: string, data: StyleState) => StyleState): unknown
  refresh(): unknown
}

export const rgba = (hex: string, alpha: number) => {
  const value = parseInt(hex.slice(1), 16)
  return 'rgba(' + (value >> 16) + ',' + ((value >> 8) & 255) + ',' + (value & 255) + ',' + alpha + ')'
}

export function applyParallelCurvatures(layout: GraphLayout) {
  layout.graph.forEachEdge((id, attrs) => {
    const index = typeof attrs.parallelIndex === 'number' ? attrs.parallelIndex : 0
    layout.graph.setEdgeAttribute(id, 'curvature', 0.12 + index * 0.18)
  })
}

export function applyGraphEmphasis(instance: GraphStyleTarget, layout: GraphLayout, structure: Structure, activePageId: string | null, matches: ReadonlySet<string>) {
  const neighborhood = new Set<string>(activePageId === null ? [] : [activePageId])
  if (activePageId !== null) for (const id of structure.neighbors.get(activePageId) ?? []) neighborhood.add(id)
  instance.setSetting('nodeReducer', (id, data) => {
    const node = layout.nodes.get(id)!
    const active = id === activePageId
    const dim = activePageId !== null && !neighborhood.has(id)
    const color = active ? '#8bc7f4' : matches.has(id) ? '#efc366' : node.hub ? '#c7e4fa' : '#829ab2'
    const labelColor = active ? '#ffffff' : matches.has(id) ? '#ffe4a6' : node.hub ? '#eef6ff' : '#c2cfdd'
    return {
      ...data,
      color: dim ? rgba(color, 0.24) : color,
      labelColor: dim ? rgba(labelColor, 0.2) : labelColor,
      labelSize: active ? 17 : node.hub ? 15 : 12,
      forceLabel: active || matches.has(id),
      size: node.size * (active ? 1.35 : 1),
      zIndex: active ? 4 : matches.has(id) ? 3 : node.hub ? 2 : 1,
    }
  })
  instance.setSetting('edgeReducer', (id, data) => {
    const source = layout.graph.source(id), target = layout.graph.target(id)
    const active = activePageId !== null && (source === activePageId || target === activePageId)
    const structural = Math.max(structure.degree.get(source) ?? 0, structure.degree.get(target) ?? 0) >= 20
    const color = active ? '#8bc7f4' : structural ? '#405a72' : '#2e4053'
    return {
      ...data,
      color: activePageId !== null && !active ? rgba(color, 0.14) : color,
      size: active ? 1.6 : structural ? 0.8 : 0.55,
      zIndex: active ? 2 : 0,
    }
  })
  instance.refresh()
}
