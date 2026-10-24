import type { CaptureView } from '../shared/contracts.js'

const LABEL: Record<CaptureView['phase'], string> = {
  queued: '等待判断', judging: '正在判断', preparing: '正在整理', verifying: '正在核验', publishing: '正在摄入',
  ingested: '已沉淀', skipped: '无需沉淀', deferred: '待补证据', failed: '暂未完成', needs_attention: '需要处理',
}

export function CaptureStatus({ capture, onOpen }: { capture: CaptureView; onOpen(pageId: string): void }) {
  return <section className="memory-wiki-panel__context-note" aria-live="polite" data-testid="mw-capture-status">
    <h4>经验沉淀 · {LABEL[capture.phase]}</h4>
    <p>{capture.reason}</p>
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
