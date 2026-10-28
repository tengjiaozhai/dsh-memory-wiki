import Graph from 'graphology'
import forceAtlas2 from 'graphology-layout-forceatlas2'
import noverlap from 'graphology-layout-noverlap'
import type { GraphPage, GraphResult } from '../shared/contracts.js'

export interface LayoutNode {
  page: GraphPage
  x: number
  y: number
  size: number
  degree: number
  hub: boolean
  labelSize: number
}

export interface GraphLayout {
  graph: Graph
  nodes: Map<string, LayoutNode>
  hubs: Set<string>
}

/** One corpus link occurrence, as the graph DTO carries it. */
type GraphLink = GraphResult['edges'][number]

/**
 * Collapse link occurrences onto one line per node pair.
 *
 * The corpus records every occurrence: a page may cite a neighbour twice, and
 * two pages may cite each other. The drawn graph is undirected, so all of them
 * are the same connection and must be the same line. The first occurrence wins,
 * which keeps direction and `source` deterministic across renders.
 */
function uniqueLinks(result: GraphResult): GraphLink[] {
  const seen = new Set<string>()
  const links: GraphLink[] = []
  for (const edge of result.edges) {
    const key = edge.from < edge.to ? edge.from + '\u0000' + edge.to : edge.to + '\u0000' + edge.from
    if (seen.has(key)) continue
    seen.add(key)
    links.push(edge)
  }
  return links
}

/** Visual hierarchy comes only from real, undirected link degree. */
export function graphStructure(result: GraphResult) {
  const degree = new Map(result.pages.map(page => [page.pageId, 0]))
  const neighbors = new Map(result.pages.map(page => [page.pageId, new Set<string>()]))
  // Endpoints must exist and a self-loop is not a connection between two nodes.
  const links = uniqueLinks(result).filter(edge => edge.from !== edge.to && degree.has(edge.from) && degree.has(edge.to))
  for (const edge of links) {
    degree.set(edge.from, degree.get(edge.from)! + 1)
    degree.set(edge.to, degree.get(edge.to)! + 1)
    neighbors.get(edge.from)!.add(edge.to)
    neighbors.get(edge.to)!.add(edge.from)
  }
  const limit = Math.min(10, Math.max(1, Math.ceil(result.pages.length * 0.1)))
  const hubs = new Set([...degree].filter(([, value]) => value >= 10).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([id]) => id))
  // `links` is what the canvas draws and what the panel counts: one entry per pair.
  return { degree, neighbors, hubs, links }
}

/** Deterministic, bounded layout: FA2 clusters real links, noverlap separates hubs. */
export function layoutGraph(result: GraphResult): GraphLayout {
  const { degree, hubs, links } = graphStructure(result)
  const graph = new Graph({ multi: true, allowSelfLoops: false })
  const ordered = [...result.pages].sort((a, b) => a.pageId.localeCompare(b.pageId))
  const nodes = new Map<string, LayoutNode>()
  ordered.forEach((page, index) => {
    const count = degree.get(page.pageId) ?? 0
    const hub = hubs.has(page.pageId)
    const angle = index * 2.399963229728653
    const radius = Math.sqrt(index + 1) * 8
    const node: LayoutNode = {
      page,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: hub ? Math.min(9, 6 + Math.sqrt(count) * 0.3) : 3.4 + Math.min(2.2, Math.sqrt(count) * 0.35),
      degree: count,
      hub,
      labelSize: hub ? 15 : 12,
    }
    nodes.set(page.pageId, node)
    graph.addNode(page.pageId, {
      ...node,
      label: page.title,
      color: hub ? '#c7e4fa' : '#829ab2',
      labelColor: hub ? '#eef6ff' : '#c2cfdd',
      labelSize: node.labelSize,
      labelVisibility: hub ? 'visible' : 'auto',
      zIndex: hub ? 2 : 1,
    })
  })
  links.forEach((edge, index) => {
    const structural = Math.max(degree.get(edge.from) ?? 0, degree.get(edge.to) ?? 0) >= 20
    graph.addEdgeWithKey('edge-' + index, edge.from, edge.to, {
      source: edge.source,
      path: 'curved',
      color: structural ? '#405a72' : '#2e4053',
      size: structural ? 0.8 : 0.55,
      opacity: structural ? 0.62 : 0.4,
    })
  })
  const inferred = forceAtlas2.inferSettings(graph)
  forceAtlas2.assign(graph, {
    iterations: graph.order < 10 ? 80 : 180,
    settings: { ...inferred, gravity: 1.6, scalingRatio: 12, slowDown: 5, barnesHutOptimize: graph.order > 60 },
  })
  noverlap.assign(graph, {
    maxIterations: 140,
    inputReducer: (id, attrs) => ({ x: attrs.x, y: attrs.y, size: hubs.has(id) ? 34 : 12 }),
    settings: { margin: 4, ratio: 1, expansion: 1.15, speed: 2 },
  })
  graph.forEachNode((id, attrs) => {
    const node = nodes.get(id)!
    node.x = attrs.x
    node.y = attrs.y
  })
  return { graph, nodes, hubs }
}
