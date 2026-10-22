/**
 * core/retrieval.ts — page-level lexical retrieval + one-hop link expansion.
 *
 * Baseline (design §5.1): CJK bigrams + latin word terms + BM25-style ranking,
 * page level, top 2. Sections are only used to cut the body of already recalled
 * pages, never as a separate h2 index. This is a reproducible lexical baseline,
 * not a claim of semantic understanding.
 *
 * Expansion (design §4.3): only from direct hits, default one hop, at most 3
 * linked pages per direct hit and at most 8 candidate pages in total.
 */
import type {
  Candidate,
  CorpusSnapshot,
  Hops,
  RetrievalReport,
  WikiPage,
} from './types.js'
import { reportEdges } from './wiki-corpus.js'

const ASCII_TERM_RE = /[a-z0-9_]+/g
const CJK_RUN_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+/g

/**
 * Tokenize into prefixed terms.
 *
 * `w:` latin/digit words (>=2 chars), `b:` CJK bigrams, and a single `b:` char
 * for a one-character CJK run. Prefixes keep the two spaces from colliding.
 */
export function tokenize(text: string): string[] {
  if (typeof text !== 'string' || text.length === 0) return []
  const lower = text.toLowerCase()
  const terms: string[] = []
  ASCII_TERM_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = ASCII_TERM_RE.exec(lower)) !== null) {
    const word = match[0]
    if (word.length >= 2) terms.push(`w:${word}`)
  }
  CJK_RUN_RE.lastIndex = 0
  while ((match = CJK_RUN_RE.exec(lower)) !== null) {
    const run = match[0]
    if (run.length === 1) {
      terms.push(`b:${run}`)
      continue
    }
    for (let i = 0; i + 1 < run.length; i += 1) terms.push(`b:${run.slice(i, i + 2)}`)
  }
  return terms
}

interface Doc {
  pageId: string
  tf: Map<string, number>
  length: number
}

interface LexicalIndex {
  docs: Doc[]
  byId: Map<string, Doc>
  df: Map<string, number>
  avgLength: number
  n: number
}

const indexCache = new WeakMap<object, LexicalIndex>()

const TITLE_WEIGHT = 3
const ALIAS_WEIGHT = 2

function buildIndex(corpus: CorpusSnapshot): LexicalIndex {
  const docs: Doc[] = []
  const byId = new Map<string, Doc>()
  const df = new Map<string, number>()
  let totalLength = 0
  for (const pageId of corpus.pageIds) {
    const page = corpus.pages.get(pageId) as WikiPage
    const tf = new Map<string, number>()
    const add = (text: string, weight: number) => {
      for (const term of tokenize(text)) tf.set(term, (tf.get(term) ?? 0) + weight)
    }
    add(page.body, 1)
    for (let i = 0; i < TITLE_WEIGHT; i += 1) add(page.title, 1)
    for (let i = 0; i < ALIAS_WEIGHT; i += 1) add(page.meta.aliases.join(' '), 1)
    let length = 0
    for (const count of tf.values()) length += count
    const doc: Doc = { pageId, tf, length }
    docs.push(doc)
    byId.set(pageId, doc)
    totalLength += length
    for (const term of tf.keys()) df.set(term, (df.get(term) ?? 0) + 1)
  }
  const index: LexicalIndex = {
    docs,
    byId,
    df,
    avgLength: docs.length > 0 ? totalLength / docs.length : 0,
    n: docs.length,
  }
  indexCache.set(corpus as unknown as object, index)
  return index
}

function indexOf(corpus: CorpusSnapshot): LexicalIndex {
  return indexCache.get(corpus as unknown as object) ?? buildIndex(corpus)
}

function idfOf(index: LexicalIndex, term: string): number {
  const df = index.df.get(term) ?? 0
  return Math.log(1 + (index.n - df + 0.5) / (df + 0.5))
}

const K1 = 1.5
const B = 0.75

function bm25(index: LexicalIndex, doc: Doc, queryTerms: readonly string[]): { score: number; matched: string[] } {
  const avg = index.avgLength > 0 ? index.avgLength : 1
  let score = 0
  const matched: { term: string; gain: number; idf: number }[] = []
  for (const term of queryTerms) {
    const tf = doc.tf.get(term)
    if (tf === undefined || tf === 0) continue
    const idf = idfOf(index, term)
    const denominator = tf + K1 * (1 - B + B * (doc.length / avg))
    const gain = idf * ((tf * (K1 + 1)) / denominator)
    score += gain
    matched.push({ term, gain, idf })
  }
  matched.sort((a, b) => (b.gain === a.gain ? (a.term < b.term ? -1 : 1) : b.gain - a.gain))
  return { score, matched: matched.map((entry) => entry.term) }
}

export interface SearchOptions {
  query: string
  /** Default 1 (design §4.3). */
  hops?: Hops
  /** Direct page hits; default 2 (design §5.1). */
  directLimit?: number
  /** Linked candidates per direct hit; default 3. */
  perPageLinks?: number
  /** Total candidate pages; default 8. */
  maxCandidates?: number
}

/**
 * Search one immutable corpus snapshot.
 *
 * Returns candidates with an explanation for each (命中依据), the relation
 * (direct / linked) and the verified library revision. Selection itself is not
 * decided here: `selected` starts false and only the compiler flips it, so the
 * UI can never show "candidate === included".
 */
export function search(corpus: CorpusSnapshot, options: SearchOptions): RetrievalReport {
  const query = typeof options.query === 'string' ? options.query : ''
  const hops: Hops = options.hops === 0 ? 0 : 1
  const directLimit = Math.max(0, options.directLimit ?? 2)
  const perPageLinks = Math.max(0, options.perPageLinks ?? 3)
  const maxCandidates = Math.max(0, options.maxCandidates ?? 8)

  const queryTerms = [...new Set(tokenize(query))]
  const index = indexOf(corpus)
  const candidates: Candidate[] = []

  if (queryTerms.length > 0 && directLimit > 0) {
    const scored: { pageId: string; score: number; why: string[] }[] = []
    for (const doc of index.docs) {
      const result = bm25(index, doc, queryTerms)
      if (result.score <= 0) continue
      scored.push({ pageId: doc.pageId, score: Number(result.score.toFixed(6)), why: result.matched.slice(0, 5) })
    }
    scored.sort((a, b) => (b.score === a.score ? (a.pageId < b.pageId ? -1 : 1) : b.score - a.score))
    const direct = scored.slice(0, directLimit)
    for (let rank = 0; rank < direct.length; rank += 1) {
      const hit = direct[rank] as { pageId: string; score: number; why: string[] }
      const page = corpus.pages.get(hit.pageId) as WikiPage
      const candidate: Candidate = {
        pageId: page.pageId,
        title: page.title,
        contentHash: page.contentHash,
        match: 'direct',
        selected: false,
        why: hit.why,
        score: hit.score,
        rank: rank + 1,
      }
      if (page.asOf !== undefined) candidate.asOf = page.asOf
      candidates.push(candidate)
    }

    if (hops === 1 && perPageLinks > 0 && candidates.length < maxCandidates) {
      const taken = new Set(candidates.map((candidate) => candidate.pageId))
      for (const directCandidate of [...candidates]) {
        if (candidates.length >= maxCandidates) break
        if (directCandidate.match !== 'direct') continue
        let added = 0
        for (const edge of outgoingEdges(corpus, directCandidate.pageId)) {
          if (added >= perPageLinks || candidates.length >= maxCandidates) break
          if (taken.has(edge.to)) continue
          const page = corpus.pages.get(edge.to)
          if (page === undefined) continue
          taken.add(edge.to)
          const linked: Candidate = {
            pageId: page.pageId,
            title: page.title,
            contentHash: page.contentHash,
            match: 'linked',
            viaPageId: directCandidate.pageId,
            selected: false,
            why: [`via ${directCandidate.pageId}`, `link:${edge.source}`],
            score: 0,
            rank: 0,
          }
          if (page.asOf !== undefined) linked.asOf = page.asOf
          candidates.push(linked)
          added += 1
        }
      }
    }
  }

  const report: RetrievalReport = {
    libraryRevision: corpus.revision,
    query,
    hops,
    candidates,
    edges: reportEdges(corpus, candidates.map((candidate) => candidate.pageId)),
  }
  return freezeReport(report)
}

interface EdgeRef {
  to: string
  source: 'body' | 'related'
}

/** Outgoing edges of one page, body edges in document order before `related`. */
export function outgoingEdges(corpus: CorpusSnapshot, pageId: string): EdgeRef[] {
  const result: EdgeRef[] = []
  for (const edge of corpus.edges) {
    if (edge.from !== pageId) continue
    result.push({ to: edge.to, source: edge.source })
  }
  return result
}

function freezeReport(report: RetrievalReport): RetrievalReport {
  for (const candidate of report.candidates) {
    Object.freeze(candidate.why)
    Object.freeze(candidate)
  }
  Object.freeze(report.candidates)
  Object.freeze(report.edges)
  return Object.freeze(report)
}
