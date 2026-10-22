import { useState } from 'react'
import type { Candidate, PageSegment } from '../core/types.js'
import { reasonLabel } from './CandidateList.js'
import { MarkdownView } from './MarkdownView.js'
import type { PageView } from './source/index.js'

/**
 * Detail pane. All page facts come from the core WikiPage DTO returned by
 * `source.readPage`; the fragment boundaries come ONLY from the caller, which
 * for the server view means `view.draft.preview.sources[].segments` (B9).
 *
 * Two things were removed on purpose:
 *   - `excerptOf()`: it sliced `page.body` by line range and re-joined the
 *     pieces. That made the panel a second Markdown compiler and let a
 *     whole-page body be presented as "this turn's fragment".
 *   - the fallback to `page.body` when no boundary existed: absence must be
 *     visible as 服务端未提供片段边界, not silently filled with more text.
 *
 * The exact submitted text stays where the server put it: `draft.preview.text`
 * (see 草稿预览). The client never assembles it.
 */
export function SourceDetail(props: {
  candidate: Candidate | undefined
  page: PageView | null
  loading: boolean
  error: string | null
  /** Server-issued boundaries, or `null` when the server provided none (B9). */
  segments: readonly PageSegment[] | null
  /** Effective selection, i.e. draft ∪ picks — never `candidate.selected` (B8). */
  selected: boolean
}) {
  const { candidate, page, loading, error, segments, selected } = props
  const [showBody, setShowBody] = useState(false)

  if (candidate === undefined) {
    return (
      <div className="memory-wiki-panel__detail">
        <p className="memory-wiki-panel__excerpt-note">候选里选一页，这里显示它的片段边界与命中依据。</p>
      </div>
    )
  }

  const excluded = reasonLabel(candidate.excludedReason)

  return (
    <div className="memory-wiki-panel__scroll memory-wiki-panel__detail" data-testid="mw-detail">
      <h3 className="memory-wiki-panel__detail-title" data-testid="mw-detail-title">
        {candidate.title}
      </h3>
      <p className="memory-wiki-panel__detail-path">{candidate.pageId}</p>
      <div className="memory-wiki-panel__detail-meta">
        <span className="memory-wiki-panel__chip">{page?.kind ?? '…'}</span>
        <span className="memory-wiki-panel__chip">资料日期 {page?.asOf ?? candidate.asOf ?? '未提供'}</span>
        <span className="memory-wiki-panel__chip">
          confidence {page?.confidence ?? '未提供'}
        </span>
        <span className="memory-wiki-panel__chip" data-testid="mw-detail-hash">
          页面哈希 {candidate.contentHash.slice(0, 12)}
        </span>
        <span className="memory-wiki-panel__chip" data-testid="mw-detail-selected">
          {selected ? '已选入本轮' : excluded ?? '未选入'}
        </span>
      </div>

      <h4 className="memory-wiki-panel__subhead">
        {selected ? '将使用的片段边界' : '候选片段边界（本轮未取用）'}
      </h4>
      <div className="memory-wiki-panel__segments" data-testid="mw-segments">
        {segments === null ? (
          <span className="memory-wiki-panel__segment" data-testid="mw-segments-missing">
            服务端未提供片段边界
          </span>
        ) : segments.length === 0 ? (
          <span className="memory-wiki-panel__segment">无</span>
        ) : (
          segments.map((segment) => (
            <span key={segment.startLine + '-' + segment.endLine} className="memory-wiki-panel__segment">
              {segment.startLine}-{segment.endLine}
            </span>
          ))
        )}
      </div>

      {error !== null ? (
        <p className="memory-wiki-panel__excerpt-note" data-testid="mw-page-error" role="alert">
          readPage 失败：{error}
        </p>
      ) : (
        <div className="memory-wiki-panel__excerpt" data-testid="mw-excerpt">
          {loading ? (
            '正在读取页面…'
          ) : segments === null ? (
            <span data-testid="mw-excerpt-unavailable">
              没有服务端片段边界，这里不拼正文，也不拿整页冒充片段。
            </span>
          ) : (
            <span className="memory-wiki-panel__excerpt-note">
              片段正文以服务端编译结果为准（见「草稿预览」的 text）；本面板不切片、不拼接。
            </span>
          )}
        </div>
      )}
      <p className="memory-wiki-panel__excerpt-note">
        行段为一基文件行号（含 frontmatter）。字符口径 UTF-16 code units。
      </p>

      <h4 className="memory-wiki-panel__subhead">命中依据</h4>
      {candidate.match === 'direct' ? (
        <div className="memory-wiki-panel__chips">
          <span className="memory-wiki-panel__chip">直接命中 · rank {candidate.rank}</span>
          <span className="memory-wiki-panel__chip">score {candidate.score.toFixed(2)}</span>
          {candidate.why.map((term) => (
            <span key={term} className="memory-wiki-panel__chip memory-wiki-panel__chip--why">
              {term}
            </span>
          ))}
        </div>
      ) : (
        <div className="memory-wiki-panel__chips">
          <span className="memory-wiki-panel__chip">关联候选</span>
          {candidate.viaPageId !== undefined && (
            <span className="memory-wiki-panel__chip">经由 {candidate.viaPageId}</span>
          )}
        </div>
      )}
      {excluded !== null && (
        <p className="memory-wiki-panel__excerpt-note" data-testid="mw-detail-reason">
          未选入原因：{excluded}（{candidate.excludedReason}）
        </p>
      )}

      <div className="memory-wiki-panel__toolbar" style={{ marginTop: 10 }}>
        <button
          type="button"
          className="memory-wiki-panel__seg"
          data-testid="mw-toggle-body"
          aria-pressed={showBody}
          onClick={() => setShowBody((value) => !value)}
        >
          <span className={showBody ? 'is-current' : ''} style={{ padding: '2px 8px' }}>
            {showBody ? '收起整页正文' : '读取整页正文（readPage）'}
          </span>
        </button>
        {page !== null && (
          <span className="memory-wiki-panel__excerpt-note" data-testid="mw-page-facts">
            {page.totalLines} 行 · body 从第 {page.bodyStartLine} 行起 · 哈希 {page.contentHash.slice(0, 12)}
            {page.truncated ? ' · 已截断' : ''}
          </span>
        )}
      </div>
      {showBody && page !== null && (
        <div className="memory-wiki-panel__excerpt memory-wiki-panel__excerpt--full" data-testid="mw-body">
          <MarkdownView source={page.body} testId="mw-body-md" />
        </div>
      )}
    </div>
  )
}
