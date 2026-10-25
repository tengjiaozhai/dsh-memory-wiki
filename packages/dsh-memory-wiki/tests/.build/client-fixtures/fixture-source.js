/**
 * Fixture implementation of the seam (test/dev only).
 *
 * Moved out of `src/client` in P3b: the production bundle must contain no
 * example knowledge, so it is injected through `registerFixtureSource()`
 * instead of being imported by the switch point. It stays the "same DTOs, same
 * view model" counterpart the seam test uses to prove fixture ↔ remote
 * consistency (and what the P3a screenshots were taken against).
 */
import { buildFixtureView, FIXTURE_DOCS, toWikiPage } from './wiki-fixture.js'
             
                   
           
                  
                
              
                                         

const DEFAULT_PRESET = 'auto1'         
const DEFAULT_BUDGET = 4000         

export function createFixtureSource()                   {
  return {
    mode: 'fixture',
    async captureStatus() { return { collector: 'disabled', history: 'readable', reasonCode: 'fixture-disabled', reason: '测试数据源不采集经验' } },
    async captureHistory() { return { items: [], readCompleteness: 'complete' } },
    async captureRecord() { return { events: [], judgments: [], evidence: [], evidenceTruncated: false, limitations: [], changes: [], error: { code: 'capture-record-unavailable' } } },
    async captureJudgment() { return { error: { code: 'capture-record-unavailable' } } },

    async getGraph() {
      const view = buildFixtureView({ preset: DEFAULT_PRESET, budget: DEFAULT_BUDGET })
      return {
        libraryRevision: view.libraryRevision ?? '',
        pages: FIXTURE_DOCS.map((entry) => {
          const page = toWikiPage(entry.pageId)
          return { pageId: page.pageId, title: page.title, kind: page.kind, contentHash: page.contentHash, ...(page.asOf === undefined ? {} : { asOf: page.asOf }) }
        }),
        edges: view.report?.edges ?? [],
        brokenLinks: 0,
      }
    },

    async getView(request             ) {
      return buildFixtureView({
        preset: request.preset ?? DEFAULT_PRESET,
        budget: request.budget ?? DEFAULT_BUDGET,
      })
    },

    /**
     * The fixture has one frozen retrieval; only the query label and the hop
     * radius are applied. No lexical scoring happens on the client — that is
     * core/retrieval.ts (server side), reached through the Remote in P3b.
     */
    async search(request               ) {
      const report = buildFixtureView({
        preset: DEFAULT_PRESET,
        budget: DEFAULT_BUDGET,
        query: request.query,
        hops: request.hops,
      }).report
      if (report === undefined) throw new Error('fixture: search produced no report')
      return report
    },

    async readPage(request                 ) {
      const page = toWikiPage(request.pageId)
      if (request.contentHash !== undefined && request.contentHash !== page.contentHash) {
        // Design §8.2: a changed page must be reported, never silently swapped.
        throw new Error(
          'page version changed: expected ' +
            request.contentHash.slice(0, 12) +
            ', found ' +
            page.contentHash.slice(0, 12),
        )
      }
      const view           = {
        pageId: page.pageId,
        title: page.title,
        kind: page.kind,
        contentHash: page.contentHash,
        ...(page.asOf === undefined ? {} : { asOf: page.asOf }),
        body: page.body,
        bodyStartLine: page.bodyStartLine,
        totalLines: page.totalLines,
        confidence: page.meta.confidence,
      }
      return view
    },
  }
}
