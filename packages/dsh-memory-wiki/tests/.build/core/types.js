/**
 * core/types.ts — shared, host-agnostic DTOs for the read-only core.
 *
 * Nothing here imports DSH. The only DTO that leaves this package (via the
 * typed Remote in P3) is EvidenceSnapshot / RetrievalReport; the rest are
 * internal-core types. Field names follow design/dsh-memory-wiki.md §6.
 */

/** Page categories, one per scanned directory. */
                                                                               

/** Snapshot budget presets (design §2: 4,000 / 8,000 chars). */
                                     

/** Who decided the selection. */
                                                   

/** Retrieval relation of a candidate to the query. */
                                           

/** Why a candidate page did not make it into the snapshot. */
                                                                          

/** Which part of the page produced a link. */
                                           

/** Hop count for the link-graph expansion (design §4.3: default 1, UI may narrow to 0). */
                        

/** Scanned subdirectories of <root>/wiki. Deliberately not recursive. */
export const CONTENT_DIRS = ['sources', 'entities', 'concepts', 'synthesis', 'outputs']         

/** Directory -> expected frontmatter `type`. */
export const DIR_KIND                           = {
  sources: 'source',
  entities: 'entity',
  concepts: 'concept',
  synthesis: 'synthesis',
  outputs: 'output',
}

/** These basenames are navigation, not retrievable content (design §4.2). */
export const SKIP_BASENAMES                      = new Set(['index', 'log'])

/** Markdown block kinds the compiler treats as atomic units. */
                       
             
               
          
           
          
           
        
          

/**
 * One atomic Markdown block. startLine/endLine are 1-based line numbers in the
 * original file, including the frontmatter lines (design §5.2).
 */
                                
                 
                                                        
                
                   
                 
                                                                             
                       
              
 

/** A contiguous line range inside one source page. */
                              
                   
                 
 

/** Versioned reference to one page (design §6 PageRef). */
                          
                
                     
               
 

/** A link occurrence parsed from a page, before target resolution. */
                          
                
                
                                             
              
                    
 

/** A resolved graph edge. */
                           
              
            
                    
                                                                         
               
 

/** A link whose target is not a valid page of this library. */
                             
              
                
                    
               
                                                             
 

/** Frontmatter scalar or list-of-scalars. */
                                                

/** Validated subset of frontmatter fields the core actually consumes. */
                           
                
               
                 
                 
                     
               
                
                   
                   
                                                                                      
                                         
 

/** One immutable parsed page. */
                                           
               
                
                                        
              
                
                                       
              
                                                  
                       
                                               
                    
                                  
                              
 

                             
                 
                     
                  
                         
                           
                  
                   
                   
                        

                              
                       
                                                                       
                 
               
                 
 

                              
                                                           
                 
                                               
               
                                               
                 
                                                               
                 
 

/**
 * One immutable library view. Every search, read and compile for a single
 * query/round takes exactly this object; nothing re-reads the disk behind it.
 */
                                 
                       
                           
                                               
                                                    
                                     
                                     
                                             
                                         
                             
 

/** One retrieval candidate (design §6 RetrievalReport candidate). */
                            
                
               
                     
               
                  
                                                                        
                    
                   
                                 
                                                                    
                        
                                                                  
               
                                                                             
              
                                                                                  
                                   
 

/** A graph edge as reported to the UI (design §6 RetrievalReport.edges). */
                                
              
            
                    
 

/** Frozen-at-retrieval candidate report; never recomputed after the fact. */
                                  
                         
               
            
                         
                        
 

/** One source page inside a frozen snapshot (design §6). */
                                                 
               
                         
 

/** The frozen evidence snapshot that the panel previews and the host submits. */
                                   
                    
                         
                        
                                                                           
                     
                           
              
                     
               
                          
 

/** A page the compiler wanted but could not take. */
                              
                
                
                        
 

/** One block that could not fit the budget. */
                               
                
                   
                 
                  
 

/** Result of compiling one selection with one budget. */
                                
              
                                                                              
               
                     
               
                                                                  
                
                           
                        
                               
                                                                    
                   
                                                                                     
                          
 
