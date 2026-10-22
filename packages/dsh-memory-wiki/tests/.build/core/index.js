/**
 * core/index.ts — the public face of the read-only core.
 *
 * The server adapter (P2) and the tests import from here; nothing below this
 * barrel imports DSH, so the whole core is exercisable without a host.
 */
export * from './types.js'
export {
  CorpusError,
  assertSafePageId,
  hasPage,
  neighbors,
  readPage,
  reportEdges,
  resolvePageId,
  scanCorpus,
  sha256,
  toPageRef,
} from './wiki-corpus.js'
                                                                                                   
export { outgoingEdges, search, tokenize } from './retrieval.js'
                                                   
export { buildSnapshot, compileSnapshot, renderSnapshotText } from './compiler.js'
                                                                                        
export {
  WIKI_TOOL_NAMES,
  WIKI_TOOL_SPECS,
  createWikiTools,
  wikiNeighbors,
  wikiRead,
  wikiSearch,
} from './tools.js'
             
            
                
             
                     
                     
                
                
                  
                  
              
                   
export { countLines, maskInlineCode, normalizeLinkTarget, parseFrontmatter, parseRawLinks, splitBlocks, splitWikilink, toLines } from './markdown.js'
                                                      
