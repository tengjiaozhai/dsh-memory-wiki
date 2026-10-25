import { useEffect, useMemo, useRef, useState } from 'react'
import Sigma from 'sigma'
import { createEdgeCurveProgram, indexParallelEdgesIndex } from '@sigma/edge-curve'
import { drawDiscNodeLabel } from 'sigma/rendering'
import type { GraphResult } from '../shared/contracts.js'
import { graphStructure, layoutGraph } from './graph-layout.js'
import { applyGraphEmphasis, applyParallelCurvatures } from './graph-style.js'
import { Icon } from './icons.js'

type Props = { visible?: boolean; graph: GraphResult; activePageId: string | null; onSelect(pageId: string): void; matches: ReadonlySet<string>; drawer: boolean; reset: number }
type Renderer = Sigma<Record<string, any>, Record<string, any>, Record<string, any>>
type LabelData = Parameters<typeof drawDiscNodeLabel>[1]
const motion = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif'
const curves = createEdgeCurveProgram({ defaultCurvature: 0.12 })

function drawLabel(context: CanvasRenderingContext2D, data: LabelData) {
  if (!data.label) return
  const size = data.labelSize ?? 13
  context.font = (data.hub ? '600 ' : '400 ') + size + 'px ' + FONT
  context.fillStyle = data.labelColor ?? '#c2cfdd'
  context.lineWidth = 3
  context.strokeStyle = '#171f27'
  context.lineJoin = 'round'
  context.strokeText(data.label, data.x + data.size + 6, data.y + size / 3)
  context.fillText(data.label, data.x + data.size + 6, data.y + size / 3)
}

function Canvas({ visible = true, graph, activePageId, onSelect, matches, drawer, reset }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const renderer = useRef<Renderer | null>(null)
  const select = useRef(onSelect)
  const visibleRef = useRef(visible)
  visibleRef.current = visible
  const focused = useRef<{ layout: unknown; page: string; drawer: boolean } | null>(null)
  const [generation, setGeneration] = useState(0)
  const [failed, setFailed] = useState(false)
  const [zoom, setZoom] = useState(100)
  const layout = useMemo(() => layoutGraph(graph), [graph])
  const structure = useMemo(() => graphStructure(graph), [graph])
  select.current = onSelect

  useEffect(() => {
    const element = host.current
    if (!element) return
    const mount = document.createElement('div')
    mount.className = 'memory-wiki-panel__sigma-instance'
    element.appendChild(mount)
    let instance: Renderer | null = null
    let frame = 0
    let observer: ResizeObserver | null = null
    let currentGeneration = 0
    const cleanup = () => {
      observer?.disconnect()
      if (frame !== 0) cancelAnimationFrame(frame)
      if (instance !== null) {
        instance.getCamera().removeAllListeners('updated')
        instance.kill()
        instance = null
      }
      mount.remove()
      renderer.current = null
    }
    const create = () => {
      currentGeneration += 1
      const expected = currentGeneration
      try {
        indexParallelEdgesIndex(layout.graph)
        applyParallelCurvatures(layout)
        const next = new Sigma(layout.graph, mount, {
          defaultEdgeType: 'curved',
          edgeProgramClasses: { curved: curves },
          defaultDrawNodeLabel: drawLabel,
          labelColor: { attribute: 'labelColor', color: '#c2cfdd' },
          labelFont: FONT,
          labelWeight: '400',
          autoRescale: true,
          autoCenter: true,
          itemSizesReference: 'screen',
          labelDensity: 0.7,
          labelGridCellSize: 165,
          labelRenderedSizeThreshold: 7,
          hideEdgesOnMove: false,
          hideLabelsOnMove: false,
          enableEdgeEvents: false,
          zIndex: true,
          minCameraRatio: 0.08,
          maxCameraRatio: 5,
          zoomingRatio: 1.22,
          zoomDuration: motion() ? 100 : 0,
          stagePadding: 48,
          minEdgeThickness: 0.45,
          allowInvalidContainer: false,
        })
        instance = next
        renderer.current = next
        next.on('clickNode', ({ node }) => select.current(node))
        next.getCamera().on('updated', () => {
          if (frame !== 0) return
          frame = requestAnimationFrame(() => {
            frame = 0
            if (instance === next) setZoom(Math.round(100 / next.getCamera().ratio))
          })
        })
        const lost = (event: Event) => { event.preventDefault(); setFailed(true) }
        const restored = () => {
          if (expected !== currentGeneration) return
          next.getCamera().removeAllListeners('updated')
          next.kill()
          mount.replaceChildren()
          create()
          if (expected === currentGeneration) setGeneration(value => value + 1)
        }
        for (const canvas of Object.values(next.getCanvases())) {
          canvas.addEventListener('webglcontextlost', lost)
          canvas.addEventListener('webglcontextrestored', restored, { once: true })
        }
        observer = new ResizeObserver(() => { if (instance === next && mount.clientWidth > 0 && mount.clientHeight > 0) next.resize() })
        observer.observe(mount)
        next.resize()
        setFailed(false)
        setGeneration(value => value + 1)
      } catch (error) {
        console.error('memory-wiki: graph renderer initialization failed', error)
        cleanup()
        setFailed(true)
      }
    }
    create()
    return cleanup
  }, [layout])

  useEffect(() => {
    if (visible && renderer.current !== null) applyGraphEmphasis(renderer.current, layout, structure, activePageId, matches)
  }, [activePageId, matches, layout, structure, generation, visible])

  useEffect(() => {
    const instance = renderer.current
    if (!visible || !instance || !host.current) return
    instance.resize()
    instance.refresh()
    if (activePageId === null) { focused.current = null; return }
    if (focused.current?.layout === layout && focused.current.page === activePageId && focused.current.drawer === drawer) return
    if (!layout.graph.hasNode(activePageId) || host.current.clientWidth < 700) return
    const camera = instance.getCamera()
    focused.current = { layout, page: activePageId, drawer }
    const ratio = Math.min(camera.ratio, 0.85)
    const width = host.current.clientWidth - (drawer ? Math.min(420, host.current.clientWidth * 0.4) + 32 : 0)
    const height = host.current.clientHeight
    const attributes = layout.graph.getNodeAttributes(activePageId)
    const point = instance.graphToViewport({ x: attributes.x, y: attributes.y })
    const zoomed = instance.getViewportZoomedState(point, ratio)
    const centre = instance.viewportToFramedGraph({ x: host.current.clientWidth / 2, y: height / 2 }, { cameraState: zoomed })
    const target = instance.viewportToFramedGraph({ x: width / 2, y: height / 2 }, { cameraState: zoomed })
    void camera.animate({ x: zoomed.x + target.x - centre.x, y: zoomed.y + target.y - centre.y, ratio: zoomed.ratio }, { duration: motion() ? 220 : 0 })
  }, [activePageId, drawer, layout, generation, visible])

  const fit = () => {
    const instance = renderer.current
    if (!instance) return
    instance.getCamera().disable()
    instance.resize(true)
    instance.getCamera().setState({ x: 0.5, y: 0.5, angle: 0, ratio: 1 })
    instance.getCamera().enable()
    instance.refresh()
  }
  useEffect(() => { if (reset > 0 && visibleRef.current) fit() }, [reset])
  const zoomCamera = (direction: number) => {
    const camera = renderer.current?.getCamera()
    if (!camera) return
    void camera.animate({ ratio: camera.getBoundedRatio(camera.ratio * (direction > 0 ? 1 / 1.35 : 1.35)) }, { duration: motion() ? 140 : 0 })
  }

  return (
    <div className="memory-wiki-panel__graph" data-testid="mw-graph">
      <div ref={host} className="memory-wiki-panel__sigma" aria-hidden="true" />
      {failed && <div className="memory-wiki-panel__graph-fallback" role="alert"><h3>当前环境无法绘制图谱</h3><p>WebGL 暂不可用。你仍可使用顶部搜索，或从下面的页面索引打开知识。</p></div>}
      <details className="memory-wiki-panel__page-index">
        <summary>页面索引<span>{graph.pages.length}</span></summary>
        <div>{graph.pages.map(page => <button type="button" key={page.pageId} data-testid="mw-node" data-page-id={page.pageId} className={page.pageId === activePageId ? 'is-active' : ''} onClick={() => onSelect(page.pageId)} aria-pressed={page.pageId === activePageId}>{page.title}</button>)}</div>
      </details>
      <div className="memory-wiki-panel__canvas-tools" aria-label="图谱视图">
        <span data-testid="mw-graph-facts">{graph.pages.length} 页 · {graph.edges.length} 条连接</span>
        <button type="button" aria-label="缩小" onClick={() => zoomCamera(-1)}><Icon name="minus" /></button>
        <span className="memory-wiki-panel__zoom" data-testid="mw-zoom">{zoom}%</span>
        <button type="button" aria-label="放大" onClick={() => zoomCamera(1)}><Icon name="plus" /></button>
        <button type="button" aria-label="显示完整图谱" onClick={fit}><Icon name="fit" /></button>
      </div>
      <div className="memory-wiki-panel__graph-legend" data-testid="mw-legend"><span><i className="is-hub" />枢纽页</span><span><i />普通页</span><span>正文与 related 链接</span></div>
    </div>
  )
}

export function EvidenceGraph(props: Props) {
  return <Canvas {...props} />
}
