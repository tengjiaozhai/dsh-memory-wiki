/**
 * core/tools.ts — the three read-only Wiki tools as pure functions.
 *
 * Design §9.4: `wiki_search` / `wiki_read` / `wiki_neighbors` must reuse the
 * same corpus, retrieval and link graph as the panel — no second parser, no
 * second index. Registration on the host is P2's job (dsh-adapter); this module
 * only publishes the contract and the implementations, plus the plain specs the
 * adapter will translate into the host's tool definition shape.
 *
 * None of these tools may create a manual override, revise a draft or consume a
 * prepared snapshot (design §9.4: "工具结果不能改选或消费用户手动覆盖").
 */
                                                                                 
                                                    
import { CorpusError, neighbors, readPage, resolvePageId } from './wiki-corpus.js'
import { search } from './retrieval.js'
import { toLines } from './markdown.js'

                           
                      
                  
                    
                  
                       
                      
                    

                            
                     
                 
 

                                                                                    

const DEFAULT_MAX_READ_CHARS = 12000

function toToolError(error         )            {
  if (error instanceof CorpusError) {
    return { code: error.code, message: error.message }
  }
  return { code: 'internal-error', message: error instanceof Error ? error.message : String(error) }
}

                                  
               
                           
             
                                         
                
 

                                  
                         
               
            
                         
 

                                
                
                                                                             
                   
                                               
                 
                                                     
                   
 

                                
                
               
              
                     
               
                                                                
                    
                                                               
                   
                                                              
                 
                
                           
                    
              
 

                                     
                
             
 

                                     
                
                         
            
                       
 

/** Search via the shared retrieval module. Never selects or freezes anything. */
export function wikiSearch(corpus                , input                 )                              {
  if (typeof input?.query !== 'string' || input.query.trim().length === 0) {
    return { ok: false, error: { code: 'invalid-argument', message: 'query must be a non-empty string' } }
  }
  const hops       = input.hops === 0 ? 0 : 1
  const limit = input.limit === undefined ? 8 : Math.max(1, Math.min(8, Math.floor(input.limit)))
  try {
    const report = search(corpus, { query: input.query, hops, maxCandidates: limit })
    return { ok: true, value: { libraryRevision: corpus.revision, query: input.query, hops, report } }
  } catch (error) {
    return { ok: false, error: toToolError(error) }
  }
}

/**
 * Read a page from this corpus, paginated by body line.
 *
 * A truncated result says so: `truncated: true` plus `nextOffset`, never a
 * short read pretending to be the whole page (design §9.4).
 */
export function wikiRead(corpus                , input               )                            {
  if (typeof input?.pageId !== 'string' || input.pageId.length === 0) {
    return { ok: false, error: { code: 'invalid-argument', message: 'pageId must be a non-empty string' } }
  }
  const maxChars =
    input.maxChars === undefined ? DEFAULT_MAX_READ_CHARS : Math.max(1, Math.floor(input.maxChars))
  const offset = input.offset === undefined ? 0 : Math.max(0, Math.floor(input.offset))
  try {
    const page           = readPage(corpus, input.pageId, {
      ...(input.revision !== undefined ? { revision: input.revision } : {}),
    })
    const bodyLines = toLines(page.body)
    if (offset > bodyLines.length) {
      return {
        ok: false,
        error: { code: 'invalid-argument', message: `offset ${offset} is past the end of ${page.pageId}` },
      }
    }
    const chosen           = []
    let length = 0
    let index = offset
    let truncated = false
    while (index < bodyLines.length) {
      const line = bodyLines[index]          
      const cost = line.length + (chosen.length === 0 ? 0 : 1)
      if (chosen.length > 0 && length + cost > maxChars) {
        truncated = true
        break
      }
      chosen.push(line)
      length += cost
      index += 1
    }
    const value                = {
      pageId: page.pageId,
      title: page.title,
      kind: page.kind,
      contentHash: page.contentHash,
      totalLines: page.totalLines,
      startLine: page.bodyStartLine + offset,
      endLine: page.bodyStartLine + index - 1,
      offset,
      nextOffset: truncated ? index : null,
      truncated,
      text: chosen.join('\n'),
    }
    if (page.asOf !== undefined) value.asOf = page.asOf
    return { ok: true, value }
  } catch (error) {
    return { ok: false, error: toToolError(error) }
  }
}

/** 0/1-hop neighbours from the shared link graph. */
export function wikiNeighbors(corpus                , input                    )                                 {
  if (typeof input?.pageId !== 'string' || input.pageId.length === 0) {
    return { ok: false, error: { code: 'invalid-argument', message: 'pageId must be a non-empty string' } }
  }
  const hops       = input.hops === 1 ? 1 : 0
  try {
    const canonical = resolvePageId(corpus, input.pageId)
    return {
      ok: true,
      value: {
        pageId: canonical,
        libraryRevision: corpus.revision,
        hops,
        nodes: neighbors(corpus, canonical, hops),
      },
    }
  } catch (error) {
    return { ok: false, error: toToolError(error) }
  }
}

/**
 * Plain, host-independent tool specs.
 *
 * P2's adapter maps these onto the host's tool definition; the shape here is a
 * JSON Schema subset so it survives that translation unchanged.
 */
export const WIKI_TOOL_SPECS = [
  {
    name: 'wiki_search',
    description:
      'Search the local LLM-Wiki (read-only). Returns up to 8 candidate pages with their library-relative pageId, content hash, match reason and whether each hit was a direct lexical hit or a one-hop link from a direct hit.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural-language question or keyword string.' },
        hops: { type: 'integer', enum: [0, 1], description: 'Link expansion depth; default 1.' },
        limit: { type: 'integer', minimum: 1, maximum: 8, description: 'Max candidate pages; default 8.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'wiki_read',
    description:
      'Read one Wiki page by its pageId (library-relative path, case preserved). Long pages are paginated by body line; a truncated result returns truncated=true and nextOffset, and must not be presented as the full page.',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: 'Canonical pageId, e.g. wiki/concepts/工具熔断.' },
        revision: { type: 'string', description: 'Optional content hash; a mismatch is reported, not papered over.' },
        offset: { type: 'integer', minimum: 0, description: '0-based body line index to start from.' },
        maxChars: { type: 'integer', minimum: 1, description: 'Soft per-call character cap; default 12000.' },
      },
      required: ['pageId'],
      additionalProperties: false,
    },
  },
  {
    name: 'wiki_neighbors',
    description:
      'Return the 0/1-hop canonical neighbours of one Wiki page from the same link graph the panel shows (body [[...]] links plus frontmatter related), with direction and edge source.',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: 'Canonical pageId.' },
        hops: { type: 'integer', enum: [0, 1], description: '0 returns no neighbours; default 0.' },
      },
      required: ['pageId'],
      additionalProperties: false,
    },
  },
]         

export const WIKI_TOOL_NAMES = ['wiki_search', 'wiki_read', 'wiki_neighbors']         

                              
                        
                                                                 
                                                           
                                                                          
 

/** Bind the pure tools to one immutable corpus view (the adapter's entry point). */
export function createWikiTools(corpus                )              {
  return {
    corpus,
    search: (input) => wikiSearch(corpus, input),
    read: (input) => wikiRead(corpus, input),
    neighbors: (input) => wikiNeighbors(corpus, input),
  }
}
