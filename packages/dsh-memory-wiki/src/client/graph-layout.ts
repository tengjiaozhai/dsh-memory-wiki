import type { GraphPage } from '../shared/contracts.js'
import type { PageLink } from '../core/types.js'

/** Stable positions from real links. Local spatial repulsion keeps labels apart. */
export function layoutGraph(pages: readonly GraphPage[], edges: readonly PageLink[]) {
  const index = new Map(pages.map((page, i) => [page.pageId, i]))
  const links = edges.flatMap((edge) => {
    const from = index.get(edge.from)
    const to = index.get(edge.to)
    return from === undefined || to === undefined || from === to ? [] : [{ from, to }]
  })
  const degree = pages.map(() => 0)
  for (const link of links) { degree[link.from]!++; degree[link.to]!++ }
  const order = pages.map((_, i) => i).sort((a, b) => degree[b]! - degree[a]! || a - b)
  const points = pages.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }))
  order.forEach((id, rank) => {
    const angle = rank * 2.399963
    const radius = Math.sqrt(rank) * 115
    points[id] = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.75, vx: 0, vy: 0 }
  })
  for (let iteration = 0; iteration < 160; iteration++) {
    const cells = new Map<string, number[]>()
    points.forEach((point, i) => {
      const key = Math.floor(point.x / 240) + ':' + Math.floor(point.y / 120)
      const cell = cells.get(key)
      if (cell === undefined) cells.set(key, [i])
      else cell.push(i)
    })
    points.forEach((point, i) => {
      const cx = Math.floor(point.x / 240), cy = Math.floor(point.y / 120)
      for (let x = cx - 1; x <= cx + 1; x++) for (let y = cy - 1; y <= cy + 1; y++) {
        for (const j of cells.get(x + ':' + y) ?? []) {
          if (j <= i) continue
          const other = points[j]!
          const dx = point.x - other.x || 0.1, dy = (point.y - other.y) * 2 || 0.1
          const distance = Math.max(1, Math.hypot(dx, dy))
          const force = Math.max(0, 230 - distance) * 0.045
          point.vx += dx / distance * force; other.vx -= dx / distance * force
          point.vy += dy / distance * force; other.vy -= dy / distance * force
        }
      }
    })
    for (const link of links) {
      const a = points[link.from]!, b = points[link.to]!
      const dx = b.x - a.x, dy = b.y - a.y
      const distance = Math.max(1, Math.hypot(dx, dy))
      const force = (distance - 210) * 0.012
      a.vx += dx / distance * force; b.vx -= dx / distance * force
      a.vy += dy / distance * force; b.vy -= dy / distance * force
    }
    const cooling = 1 - iteration / 180
    for (const point of points) {
      point.vx = (point.vx - point.x * 0.001) * 0.72
      point.vy = (point.vy - point.y * 0.001) * 0.72
      point.x += Math.max(-15, Math.min(15, point.vx)) * cooling
      point.y += Math.max(-15, Math.min(15, point.vy)) * cooling
    }
  }
  return new Map(pages.map((page, i) => [page.pageId, { x: points[i]!.x, y: points[i]!.y }]))
}
