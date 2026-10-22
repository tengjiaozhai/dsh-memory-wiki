import type { Candidate, RetrievalReport } from '../core/types.js'

const REASON_LABEL: Record<string, string> = {
  budget: '额度不足',
  'no-usable-block': '无可用块',
  'not-selected': '未选入',
}

export function reasonLabel(reason: string | undefined): string | null {
  return reason === undefined ? null : REASON_LABEL[reason] ?? reason
}

function CandidateRow(props: {
  candidate: Candidate
  active: boolean
  onSelect(pageId: string): void
}) {
  const { candidate, active, onSelect } = props
  const excluded = reasonLabel(candidate.excludedReason)
  const dot = candidate.selected ? 'is-selected' : 'is-excluded'
  return (
    <button
      type="button"
      className={'memory-wiki-panel__candidate' + (active ? ' is-active' : '')}
      data-testid="mw-candidate"
      data-page-id={candidate.pageId}
      data-selected={candidate.selected ? '1' : '0'}
      data-reason={candidate.excludedReason ?? ''}
      aria-pressed={active}
      onClick={() => onSelect(candidate.pageId)}
    >
      <span className="memory-wiki-panel__candidate-top">
        <i className={'memory-wiki-panel__dot ' + dot} />
        <span className="memory-wiki-panel__candidate-title">{candidate.title}</span>
      </span>
      <span className="memory-wiki-panel__candidate-id">{candidate.pageId}</span>
      {candidate.why.length > 0 && (
        <span className="memory-wiki-panel__chips" data-testid="mw-why">
          {candidate.why.map((term) => (
            <span key={term} className="memory-wiki-panel__chip memory-wiki-panel__chip--why">
              {term}
            </span>
          ))}
        </span>
      )}
      {candidate.viaPageId !== undefined && (
        <span className="memory-wiki-panel__via">经由 {candidate.viaPageId}</span>
      )}
      {excluded !== null && (
        <span className="memory-wiki-panel__chips">
          <span
            className={'memory-wiki-panel__chip memory-wiki-panel__chip--' + candidate.excludedReason}
            data-testid="mw-reason"
          >
            {excluded}
          </span>
        </span>
      )}
    </button>
  )
}

export function CandidateList(props: {
  report: RetrievalReport
  activePageId: string | null
  onSelect(pageId: string): void
}) {
  const { report, activePageId, onSelect } = props
  const direct = report.candidates.filter((candidate) => candidate.match === 'direct')
  const linked = report.candidates.filter((candidate) => candidate.match === 'linked')
  const selected = report.candidates.filter((candidate) => candidate.selected).length
  return (
    <div className="memory-wiki-panel__scroll" data-testid="mw-candidates">
      <div className="memory-wiki-panel__section-head">
        <span>候选</span>
        <span data-testid="mw-cand-counts">
          直接 {direct.length} / 关联 {linked.length} · 选入 {selected}
        </span>
      </div>
      <div className="memory-wiki-panel__section-head" style={{ paddingTop: 2 }}>
        <span>直接命中</span>
        <span>{report.query}</span>
      </div>
      {direct.map((candidate) => (
        <CandidateRow
          key={candidate.pageId}
          candidate={candidate}
          active={candidate.pageId === activePageId}
          onSelect={onSelect}
        />
      ))}
      <div className="memory-wiki-panel__section-head" style={{ paddingTop: 10 }}>
        <span>关联候选</span>
        <span>{report.hops === 1 ? '1 跳' : '0 跳'}</span>
      </div>
      {linked.map((candidate) => (
        <CandidateRow
          key={candidate.pageId}
          candidate={candidate}
          active={candidate.pageId === activePageId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
