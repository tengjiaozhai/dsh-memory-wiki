import type { CompileResult, EvidenceSnapshot } from '../core/types.js'

const format = (value: number) => value.toLocaleString('zh-CN')
const originLabel = (origin: string) => (origin === 'manual' ? '手选' : '自动')

/**
 * 本轮依据 + 待提交快照 + 历史快照，全部只读（design §8.1: 选入不等于提交）。
 * Every line is a DTO field: nothing here is a UI-only caption that pretends to
 * be snapshot data.
 */
export function HistoryPane(props: {
  current: CompileResult
  pending: EvidenceSnapshot
  history: EvidenceSnapshot[]
}) {
  const { current, pending, history } = props
  const row = (snapshot: EvidenceSnapshot, testid: string) => (
    <div key={snapshot.snapshotId} className="memory-wiki-panel__hist-row" data-testid={testid}>
      <strong>
        {originLabel(snapshot.origin)} · {snapshot.snapshotId}
      </strong>
      <div className="memory-wiki-panel__hist-facts">
        <span>{format(snapshot.budgetChars)} 额度</span>
        <span>{format(snapshot.chars)} 字符</span>
        <span>{snapshot.sources.length} 页</span>
        <span>lib {snapshot.libraryRevision}</span>
        <span>hash {snapshot.payloadHash.slice(0, 12)}</span>
      </div>
    </div>
  )

  return (
    <div className="memory-wiki-panel__hist" data-testid="mw-history">
      <h4 className="memory-wiki-panel__subhead">本轮依据（{current.sources.length} 页）</h4>
      {current.sources.map((source) => (
        <div key={source.pageId} className="memory-wiki-panel__hist-row" data-testid="mw-turn-source">
          <strong>{source.title}</strong>
          <div className="memory-wiki-panel__hist-facts">
            <span>{source.pageId}</span>
            <span>{source.segments.map((segment) => segment.startLine + '-' + segment.endLine).join(',')}</span>
            <span>{source.contentHash.slice(0, 12)}</span>
          </div>
        </div>
      ))}

      <h4 className="memory-wiki-panel__subhead">
        本轮快照（待提交）<span className="memory-wiki-panel__readonly">只读</span>
      </h4>
      {row(pending, 'mw-pending')}

      <h4 className="memory-wiki-panel__subhead">
        历史快照<span className="memory-wiki-panel__readonly">只读</span>
      </h4>
      {history.map((snapshot) => row(snapshot, 'mw-snapshot'))}
    </div>
  )
}
