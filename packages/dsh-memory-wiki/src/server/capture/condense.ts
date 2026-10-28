import type { EvidenceBundle } from './types.js'

/**
 * Bounded, deterministic evidence folding for Jev's context limit.
 *
 * The judge's own rubric says an assistant claim is not verification, so the
 * budget follows that hierarchy: what was asked (`user/message`), what was called
 * (`tool/call`) and how the turn ended stay intact, while long assistant replies
 * and tool output keep head+tail. Every cut leaves a visible marker, so folded
 * evidence is never mistaken for short evidence.
 *
 * Determinism matters: the same evidence and budget always produce the same
 * state, so a judgment recorded in the journal can be reproduced afterwards from
 * the stored evidence alone.
 */

/** Kinds that define the task, the actions and the outcome. Never folded. */
const FIXED_KINDS = new Set(['user/message', 'tool/call', 'turn/end', 'workspace/changes', 'assistant/attempt'])

/** Conclusions and errors live at the end of a result or reply, so the tail wins. */
const TAIL_SHARE = 0.75
/**
 * A floor, not a guarantee: on a turn whose unfoldable part nearly fills the
 * budget there is no room left, and squeezing 99 events into the remainder is
 * still better than refusing to judge at all.
 */
const MIN_QUOTA = 1

/**
 * Characters held back for the JSON envelope only. The question text is not a
 * constant: every claim adds an instruction that embeds its own text, so callers
 * pass `budget - questionChars` as the state budget instead of relying on a guess.
 */
const ENVELOPE_RESERVE = 200

export type FoldedEvent = { seq: number; kind: string; kept: number; omitted: number }

export type Condensed = {
  /** Serialized state, ready to send as Jev's `state`. */
  state: string
  chars: number
  rawChars: number
  ratio: number
  condensed: boolean
  folded: FoldedEvent[]
}

const marker = (chars: number) => `\n…[${chars} 字符未展示]…\n`

const isLowSurrogate = (code: number) => code >= 0xdc00 && code <= 0xdfff

/** Never split a surrogate pair: half of one re-encodes as U+FFFD and breaks quote matching. */
function clip(text: string, head: number, tail: number): { text: string; omitted: number } {
  if (text.length <= head + tail + 64) return { text, omitted: 0 }
  let frontEnd = Math.min(head, text.length)
  if (frontEnd > 0 && frontEnd < text.length && isLowSurrogate(text.charCodeAt(frontEnd))) frontEnd -= 1
  let backStart = Math.max(frontEnd, text.length - tail)
  if (backStart > 0 && backStart < text.length && isLowSurrogate(text.charCodeAt(backStart))) backStart += 1
  const front = frontEnd > 0 ? text.slice(0, frontEnd) : ''
  const back = backStart < text.length ? text.slice(backStart) : ''
  const cut = text.length - front.length - back.length
  return { text: front + marker(cut) + back, omitted: cut }
}

/**
 * Characters that folding can never remove: what was asked and what was called.
 * This, not the total size, decides whether a turn is structurally unjudgeable.
 */
export function unfoldableChars(events: EvidenceBundle['events']): number {
  return events.reduce((total, event) => (FIXED_KINDS.has(event.kind) ? total + event.text.length : total), 0)
}

/** Tool output carries the only verification the rubric accepts, so it outweighs prose. */
function weight(index: number, kind: string, lastAssistant: number): number {
  if (kind === 'tool/result') return 3
  if (kind === 'assistant/message') return index === lastAssistant ? 2 : 1
  return 1
}

function foldEvents(events: EvidenceBundle['events'], target: number, scale: number): { events: EvidenceBundle['events']; folded: FoldedEvent[] } {
  const lastAssistant = events.reduce((last, event, index) => (event.kind === 'assistant/message' ? index : last), -1)
  const fixedChars = events.reduce((total, event) => (FIXED_KINDS.has(event.kind) ? total + event.text.length : total), 0)
  let totalWeight = 0
  for (const [index, event] of events.entries()) if (!FIXED_KINDS.has(event.kind)) totalWeight += weight(index, event.kind, lastAssistant)
  // 0.78 leaves room for the escaping a nested JSON string costs on the second
  // serialization pass; the caller's length check remains the final authority.
  const room = Math.max(0, (target - fixedChars * 1.15) * 0.78) * scale
  const folded: FoldedEvent[] = []
  const output = events.map((event, index) => {
    if (FIXED_KINDS.has(event.kind)) return event
    const quota = Math.max(MIN_QUOTA, Math.floor(room * (weight(index, event.kind, lastAssistant) / (totalWeight || 1))))
    const tail = Math.floor(quota * TAIL_SHARE)
    const result = clip(event.text, quota - tail, tail)
    if (result.omitted > 0) folded.push({ seq: event.seq, kind: event.kind, kept: result.text.length, omitted: result.omitted })
    return result.text === event.text ? event : { ...event, text: result.text }
  })
  return { events: output, folded }
}

const serialize = (evidence: EvidenceBundle, events: EvidenceBundle['events']) => JSON.stringify({ ...evidence, events })

/** Fold one evidence bundle so its serialized state fits `budgetChars`. */
export function condenseEvidence(evidence: EvidenceBundle, budgetChars: number): Condensed {
  const rawState = serialize(evidence, evidence.events)
  if (rawState.length <= budgetChars) {
    return { state: rawState, chars: rawState.length, rawChars: rawState.length, ratio: 1, condensed: false, folded: [] }
  }
  const target = Math.max(1_000, budgetChars - ENVELOPE_RESERVE)
  const build = (scale: number) => {
    const { events, folded } = foldEvents(evidence.events, target, scale)
    return { state: serialize(evidence, events), folded }
  }
  // Serialized size is monotone in `scale`, so bisect: a 17x reduction then costs
  // the same number of passes as a 2x one. Multiplying instead converges too
  // slowly on multi-megabyte turns and leaves them over budget.
  let lo = 0
  let hi = 1
  let best: { state: string; folded: FoldedEvent[] } | null = null
  for (let pass = 0; pass < 10; pass++) {
    const mid = (lo + hi) / 2
    const built = build(mid)
    if (built.state.length <= target) { best = built; lo = mid } else hi = mid
  }
  // `condensed` means "content was actually removed", not "a budget was applied":
  // when every event is a fixed kind nothing is folded and the caller must reject.
  if (best) return { state: best.state, chars: best.state.length, rawChars: rawState.length, ratio: rawState.length / best.state.length, condensed: best.folded.length > 0, folded: best.folded }
  const floor = build(0)
  return { state: floor.state, chars: floor.state.length, rawChars: rawState.length, ratio: rawState.length / floor.state.length, condensed: floor.folded.length > 0, folded: floor.folded }
}

export type VerificationInput = {
  evidence: EvidenceBundle
  files: unknown
  claims: unknown
  comparisonPages: unknown
  comparisonIndex: unknown
}

/**
 * Fold only the evidence inside a verification state.
 *
 * `files` and `comparisonPages` are the text under review: shortening them would
 * make the verdict meaningless, so a state that still exceeds the budget is
 * rejected by the caller rather than silently trimmed. The caller must therefore
 * pass a `files` view that excludes derived copies of the evidence itself, or the
 * evidence is paid for twice and no large turn can ever verify.
 *
 * `budgetChars` is the room left for the state after the question text.
 */
export function condenseVerification(input: VerificationInput, budgetChars: number): Condensed {
  const rawState = JSON.stringify(input)
  if (rawState.length <= budgetChars) {
    return { state: rawState, chars: rawState.length, rawChars: rawState.length, ratio: 1, condensed: false, folded: [] }
  }
  const { evidence, ...rest } = input
  const restChars = JSON.stringify(rest).length
  const foldedEvidence = condenseEvidence(evidence, Math.max(1_000, budgetChars - restChars))
  const state = JSON.stringify({ evidence: JSON.parse(foldedEvidence.state), ...rest })
  return { state, chars: state.length, rawChars: rawState.length, ratio: rawState.length / state.length, condensed: foldedEvidence.condensed, folded: foldedEvidence.folded }
}
