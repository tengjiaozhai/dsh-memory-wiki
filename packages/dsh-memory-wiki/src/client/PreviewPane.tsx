import type { CompileResult } from '../core/types.js'

const format = (value: number) => value.toLocaleString('zh-CN')

/**
 * The exact text the snapshot would submit. Design §5.2: the panel shows
 * compile.text verbatim — the client never re-assembles it.
 */
export function PreviewPane(props: { result: CompileResult }) {
  const { result } = props
  return (
    <div className="memory-wiki-panel__preview" data-testid="mw-preview">
      <div className="memory-wiki-panel__section-head">
        <span>待带入文本 = snapshot.text</span>
        <span data-testid="mw-preview-facts">
          {format(result.chars)} 字符 · {result.sources.length} 页 · hash {result.payloadHash.slice(0, 12)}
        </span>
      </div>
      <pre className="memory-wiki-panel__pre" data-testid="mw-preview-text">
        {result.text}
      </pre>
    </div>
  )
}
