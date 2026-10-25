import type { CaptureHistoryInput, CaptureHistoryResult, CaptureJudgmentInput, CaptureJudgmentResult, CaptureRecordInput, CaptureRecordResult, CaptureStatusInput, CaptureStatusResult, RemoteError } from '../../shared/contracts.js'
import { CaptureJournal } from './journal.js'

/** Read-only facade: session existence is checked before any job contents are returned. */
export class CaptureHistory {
  constructor(private readonly journal: CaptureJournal, private readonly sessionError: (sessionId: string) => RemoteError | undefined, private readonly collector: () => Pick<CaptureStatusResult, 'collector' | 'reason'>, private readonly unavailable = false) {}

  status(input: CaptureStatusInput): CaptureStatusResult {
    const state = this.collector()
    const history = this.unavailable ? 'unavailable' : this.journal.scan().history
    const error = input.sessionId === undefined ? undefined : this.sessionError(input.sessionId)
    return { ...state, reasonCode: 'collector-' + state.collector, history, ...(error ? { error } : input.sessionId ? { lastIssue: this.journal.issue(input.sessionId) } : {}) }
  }
  list(input: CaptureHistoryInput): CaptureHistoryResult {
    const error = this.sessionError(input.sessionId) ?? (this.unavailable ? { code: 'capture-unavailable' as const } : undefined)
    return error ? { items: [], readCompleteness: 'partial', error } : this.journal.list(input)
  }
  record(input: CaptureRecordInput): CaptureRecordResult {
    const error = this.sessionError(input.sessionId) ?? (this.unavailable ? { code: 'capture-unavailable' as const } : undefined)
    return error ? { events: [], judgments: [], evidence: [], evidenceTruncated: false, changes: [], limitations: [], error } : this.journal.record(input)
  }
  judgment(input: CaptureJudgmentInput): CaptureJudgmentResult {
    const error = this.sessionError(input.sessionId) ?? (this.unavailable ? { code: 'capture-unavailable' as const } : undefined)
    return error ? { error } : this.journal.judgment(input)
  }
}
