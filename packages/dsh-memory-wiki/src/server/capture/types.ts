import type { CaptureView } from '../../shared/contracts.js'
export type { CaptureView } from '../../shared/contracts.js'
export type CapturePhase = CaptureView['phase']
export type WriterRoute = { provider: string; model: string; reasoningEffort?: string }
export type RawEvent = { seq: number; type: string; data: any }
export type EvidenceBundle = {
  jobId: string
  origin: { sessionId: string; turn: number; turnStartSeq: number; turnEndSeq: number }
  outcome: string
  workspaceIdentity: string
  requestedTask: string
  events: Array<{ seq: number; kind: string; text: string; hash: string }>
  changes?: Array<{ path: string; evidenceRef: number; detail: string; attribution: 'tool-recorded' }>
  checks?: Array<{ callRef: number; evidenceRef: number; command: string; output: string; isError: boolean }>
  limitations: string[]
  contentHash: string
}
export type CaptureJob = Omit<CaptureView, 'evidence' | 'changes' | 'limitations'> & {
  evidence: EvidenceBundle
  route?: WriterRoute
  model?: string
  rubricVersion: string
  authorization: string
  prepared?: PreparedIngest
  verifiedPatchHash?: string
  retryable?: boolean
}
export type Claim = { text: string; evidenceRefs: number[]; quotes: Array<{ seq: number; text: string }> }
export type FileChange = { path: string; before: string | null; after: string }
export type PreparedIngest = {
  jobId: string
  stageRoot: string
  rulesHash: string
  readVersions: Array<{ path: string; hash: string }>
  comparisonPages: Array<{ path: string; content: string }>
  comparisonIndex: Array<{ pageId: string; title: string; aliases: string[] }>
  files: FileChange[]
  claims: Claim[]
  patchHash: string
}
export type Assessment = { disposition: 'prepare' | 'skipped' | 'deferred'; reason: string; model: string }
export type Verification = { disposition: 'publish' | 'skipped' | 'deferred'; reason: string; model: string }
export const RUBRIC_VERSION = 'coding-experience-v1'
