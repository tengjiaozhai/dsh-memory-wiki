import type { CaptureView } from '../shared/contracts.js'

import { CAPTURE_LABEL } from './CaptureHistory.js'

export function CaptureStatus({ capture, onOpen, onHistory }: { capture: CaptureView; onOpen(pageId: string): void; onHistory?(): void }) {
  return <section className="memory-wiki-panel__context-note" aria-live="polite" data-testid="mw-capture-status">
    <h4>经验沉淀 · {CAPTURE_LABEL[capture.phase]}</h4>
    <p>{capture.reason}</p>
    {onHistory && <button type="button" onClick={onHistory}>查看完整沉淀记录</button>}
    {capture.phase === 'ingested' && capture.pages.filter(page => !page.startsWith('wiki/sources/')).map(page =>
      <button type="button" key={page} onClick={() => onOpen(page)}>{page.split('/').at(-1)}</button>)}
    <details><summary>证据与改动记录</summary><p>{capture.jobId}</p>
      {capture.limitations?.map(limit => <p key={limit}>{limit}</p>)}
      {capture.changes?.map(change => <p key={change.path}><code>{change.path}</code> · {change.beforeHash ? '更新' : '新增'}</p>)}
      {capture.evidence?.map(event => <details key={event.seq}><summary>seq {event.seq} · {event.kind}</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{event.text}</pre>{event.truncated && <p>此处仅展示前 1,000 字符，完整证据保存在本地任务记录。</p>}</details>)}
      {capture.evidenceTruncated && <p>此处仅展示前 12 条事件。</p>}
    </details>
  </section>
}
