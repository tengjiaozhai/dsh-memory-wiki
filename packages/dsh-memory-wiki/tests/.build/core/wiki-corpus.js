/**
 * core/wiki-corpus.ts — the one read path into the local Wiki library.
 *
 * Responsibilities (design §4.2 / §4.3):
 *   - scan <root>/wiki/{sources,entities,concepts,synthesis,outputs}/*.md, no recursion
 *   - skip index.md / log.md
 *   - parse frontmatter once, validate the fields this plugin depends on
 *   - pageId = canonical library-relative path with the real case preserved
 *   - contentHash per page; libraryRevision over the path set + hash set
 *   - link graph = body [[...]] + frontmatter related, edge keeps its source
 *   - refuse absolute paths, `..` segments and symlinks that leave the library
 *
 * The returned snapshot is the single immutable corpus view every other module
 * consumes for one query/round; nothing re-reads the disk behind it.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

             
              
                 
             
       
             
           
           
          
           
          
           
                   
import { CONTENT_DIRS, DIR_KIND, SKIP_BASENAMES } from './types.js'
import { parseFrontmatter, parseRawLinks, splitBlocks } from './markdown.js'

                             
                  
                    
                  
                       
                      

export class CorpusError extends Error {
           code                 

  constructor(code                 , message        ) {
    super(message)
    this.name = 'CorpusError'
    this.code = code
  }
}

const VALID_KINDS                      = new Set(['source', 'entity', 'concept', 'synthesis', 'output'])

/** Hex sha256 of a UTF-8 string. */
export function sha256(text        )         {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex')
}

/**
 * Validate a page id before it is ever joined to a filesystem path.
 *
 * Rejected: absolute paths, Windows drive prefixes, backslashes, NUL bytes,
 * empty/./.. segments and doubled separators. Case is preserved verbatim
 * (design §4.2: pageId keeps the library's real case).
 */
export function assertSafePageId(pageId        )         {
  if (typeof pageId !== 'string' || pageId.length === 0) {
    throw new CorpusError('unsafe-page-id', 'pageId must be a non-empty string')
  }
  if (pageId !== pageId.trim()) {
    throw new CorpusError('unsafe-page-id', `pageId has surrounding whitespace: ${JSON.stringify(pageId)}`)
  }
  if (pageId.includes('\\')) {
    throw new CorpusError('unsafe-page-id', `pageId must use forward slashes: ${pageId}`)
  }
  if (pageId.includes('\u0000')) {
    throw new CorpusError('unsafe-page-id', 'pageId must not contain NUL')
  }
  if (pageId.startsWith('/')) {
    throw new CorpusError('unsafe-page-id', `pageId must be library-relative: ${pageId}`)
  }
  if (/^[A-Za-z]:/.test(pageId)) {
    throw new CorpusError('unsafe-page-id', `pageId must not carry a drive prefix: ${pageId}`)
  }
  const segments = pageId.split('/')
  for (const segment of segments) {
    if (segment.length === 0) {
      throw new CorpusError('unsafe-page-id', `pageId has an empty segment: ${pageId}`)
    }
    if (segment === '.' || segment === '..') {
      throw new CorpusError('unsafe-page-id', `pageId must not contain . or .. segments: ${pageId}`)
    }
  }
  return pageId
}

function isUnder(parentReal        , childReal        )          {
  if (childReal === parentReal) return true
  return childReal.startsWith(parentReal + path.sep)
}

function asStringList(value         )           {
  if (typeof value === 'string') return value.length > 0 ? [value] : []
  if (Array.isArray(value)) return value.filter((item)                 => typeof item === 'string')
  return []
}

function firstString(...values           )                     {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  }
  return undefined
}

                              
                                                               
              
                                                          
                          
 

                      
                
              
             
              
 

/**
 * Scan and parse the library into one frozen snapshot.
 *
 * A file whose metadata fails validation is reported as an issue and left out
 * of `pages`, but still contributes to `revision` — a broken page is still a
 * change in the library, and the caller must not believe it did not happen.
 */
export function scanCorpus(options             )                 {
  const rootAbs = path.resolve(options.root ?? '')
  let rootReal        
  try {
    rootReal = fs.realpathSync(rootAbs)
  } catch {
    throw new CorpusError('invalid-root', `wikiRoot does not exist: ${options.root}`)
  }
  if (!fs.statSync(rootReal).isDirectory()) {
    throw new CorpusError('invalid-root', `wikiRoot is not a directory: ${options.root}`)
  }

  const dirs = options.dirs ?? CONTENT_DIRS
  const issues                = []
  const revisionParts           = []
  const parsedFiles               = []
  let scanned = 0
  let invalid = 0
  let skipped = 0

  for (const dir of dirs) {
    const dirAbs = path.join(rootReal, 'wiki', dir)
    let entries             
    try {
      entries = fs.readdirSync(dirAbs, { withFileTypes: true })
    } catch {
      issues.push({ code: 'missing-dir', path: dirAbs, message: `content dir wiki/${dir} is missing` })
      continue
    }

    const sortedEntries = [...entries].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    for (const entry of sortedEntries) {
      const name = entry.name
      const fullPath = path.join(dirAbs, name)
      const isLink = entry.isSymbolicLink()
      if (entry.isDirectory() && !isLink) {
        skipped += 1
        issues.push({ code: 'nested-dir-ignored', path: fullPath, message: `wiki/${dir} is not scanned recursively` })
        continue
      }
      if (!name.endsWith('.md')) {
        skipped += 1
        continue
      }
      const baseName = name.slice(0, -3)
      if (SKIP_BASENAMES.has(baseName)) {
        skipped += 1
        continue
      }

      let readPath = fullPath
      if (isLink) {
        let linkedReal        
        try {
          linkedReal = fs.realpathSync(fullPath)
        } catch {
          issues.push({ code: 'escaped-root', path: fullPath, message: 'symlink cannot be resolved' })
          skipped += 1
          continue
        }
        if (!isUnder(rootReal, linkedReal)) {
          issues.push({ code: 'escaped-root', path: fullPath, message: 'symlink points outside the library' })
          skipped += 1
          continue
        }
        readPath = linkedReal
      }

      let stat          
      try {
        stat = fs.statSync(readPath)
      } catch {
        issues.push({ code: 'unreadable-file', path: fullPath, message: 'stat failed' })
        skipped += 1
        continue
      }
      if (!stat.isFile()) {
        skipped += 1
        continue
      }

      let raw        
      try {
        raw = fs.readFileSync(readPath, 'utf8')
      } catch {
        issues.push({ code: 'unreadable-file', path: fullPath, message: 'read failed' })
        skipped += 1
        continue
      }

      scanned += 1
      parsedFiles.push({
        pageId: `wiki/${dir}/${baseName}`,
        path: fullPath,
        raw,
        hash: sha256(raw),
      })
    }
  }

  const pages = new Map                  ()
  for (const file of parsedFiles) {
    revisionParts.push(`${file.pageId}\t${file.hash}`)
    const expectedKind = DIR_KIND[dirNameOf(file.pageId)]
    const frontmatter = parseFrontmatter(file.raw)
    if (!frontmatter.ok) {
      invalid += 1
      issues.push({
        code: frontmatter.error === 'no-frontmatter' ? 'missing-frontmatter' : 'malformed-frontmatter',
        pageId: file.pageId,
        path: file.path,
        message: frontmatter.error ?? 'frontmatter error',
      })
      continue
    }

    const rawType = frontmatter.value.type
    const typeValue = typeof rawType === 'string' ? rawType : undefined
    if (typeValue === undefined) {
      invalid += 1
      issues.push({ code: 'missing-type', pageId: file.pageId, path: file.path, message: 'frontmatter has no type' })
      continue
    }
    if (!VALID_KINDS.has(typeValue) || typeValue !== expectedKind) {
      invalid += 1
      issues.push({
        code: 'type-mismatch',
        pageId: file.pageId,
        path: file.path,
        message: `type ${typeValue} does not match directory wiki/${dirNameOf(file.pageId)} (expected ${expectedKind})`,
      })
      continue
    }

    const rawTitle = frontmatter.value.title
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''
    if (title.length === 0) {
      invalid += 1
      issues.push({ code: 'missing-title', pageId: file.pageId, path: file.path, message: 'frontmatter has no title' })
      continue
    }

    const meta           = {
      type: typeValue            ,
      title,
      tags: asStringList(frontmatter.value.tags),
      aliases: asStringList(frontmatter.value.aliases),
      related: asStringList(frontmatter.value.related),
      extra: { ...frontmatter.value },
    }
    const domain = firstString(frontmatter.value.domain)
    if (domain !== undefined) meta.domain = domain
    const status = firstString(frontmatter.value.status)
    if (status !== undefined) meta.status = status
    const confidence = firstString(frontmatter.value.confidence)
    if (confidence !== undefined) meta.confidence = confidence
    const asOf = firstString(frontmatter.value.as_of, frontmatter.value.captured, frontmatter.value.date)
    if (asOf !== undefined) meta.asOf = asOf

    const blocks = splitBlocks(frontmatter.body, frontmatter.bodyStartLine)
    const rawLinks = parseRawLinks(blocks)
    const page           = {
      pageId: file.pageId,
      contentHash: file.hash,
      title,
      kind: typeValue            ,
      path: file.path,
      meta,
      body: frontmatter.body,
      bodyStartLine: frontmatter.bodyStartLine,
      totalLines: frontmatter.totalLines,
      blocks,
      rawLinks,
    }
    if (asOf !== undefined) page.asOf = asOf
    Object.freeze(meta.tags)
    Object.freeze(meta.aliases)
    Object.freeze(meta.related)
    Object.freeze(meta.extra)
    Object.freeze(meta)
    Object.freeze(blocks)
    Object.freeze(rawLinks)
    Object.freeze(page)
    pages.set(page.pageId, page)
  }

  const pageIds = [...pages.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  const lowerIndex = new Map                ()
  const lowerDuplicates = new Set        ()
  for (const pageId of pageIds) {
    const key = pageId.toLowerCase()
    if (lowerIndex.has(key)) lowerDuplicates.add(key)
    else lowerIndex.set(key, pageId)
  }

  const edges             = []
  const brokenLinks               = []
  const resolve = (target        )                                                     => {
    try {
      assertSafePageId(target)
    } catch {
      return { reason: 'unsafe-target' }
    }
    if (pages.has(target)) return { pageId: target }
    const key = target.toLowerCase()
    if (lowerDuplicates.has(key)) return { reason: 'ambiguous-case' }
    const hit = lowerIndex.get(key)
    if (hit !== undefined) return { pageId: hit }
    return { reason: 'unknown-page' }
  }

  for (const pageId of pageIds) {
    const page = pages.get(pageId)            
    for (const link of page.rawLinks                      ) {
      const resolved = resolve(link.target)
      if (resolved.pageId !== undefined) {
        const edge           = { from: pageId, to: resolved.pageId, source: 'body', line: link.line }
        edges.push(edge)
      } else {
        const broken             = {
          from: pageId,
          target: link.target,
          source: 'body',
          line: link.line,
          reason: resolved.reason ?? 'unknown-page',
        }
        brokenLinks.push(broken)
      }
    }
    for (const relatedTarget of page.meta.related) {
      const resolved = resolve(relatedTarget)
      if (resolved.pageId !== undefined) {
        edges.push({ from: pageId, to: resolved.pageId, source: 'related' })
      } else {
        brokenLinks.push({
          from: pageId,
          target: relatedTarget,
          source: 'related',
          reason: resolved.reason ?? 'unknown-page',
        })
      }
    }
  }

  revisionParts.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  const revision = sha256(revisionParts.join('\n')).slice(0, 16)

  const snapshot                 = {
    root: rootReal,
    revision,
    pages,
    pageIds,
    edges: Object.freeze(edges),
    brokenLinks: Object.freeze(brokenLinks),
    issues: Object.freeze(issues),
    stats: Object.freeze({ scanned, valid: pages.size, invalid, skipped }),
  }
  Object.freeze(pageIds)
  return Object.freeze(snapshot)
}

function dirNameOf(pageId        )         {
  const segments = pageId.split('/')
  return segments.length >= 3 ? (segments[1]          ) : ''
}

/** True when the page id is a valid member of this snapshot. */
export function hasPage(corpus                , pageId        )          {
  try {
    assertSafePageId(pageId)
  } catch {
    return false
  }
  return corpus.pages.has(pageId)
}

/**
 * Resolve a page id, keeping the library's real case.
 *
 * Exact match wins; otherwise a unique case-insensitive match is accepted so a
 * hand-written `[[wiki/Concepts/x]]` in prose still lands on the real page.
 */
export function resolvePageId(corpus                , pageId        )         {
  assertSafePageId(pageId)
  if (corpus.pages.has(pageId)) return pageId
  const key = pageId.toLowerCase()
  const matches = corpus.pageIds.filter((candidate) => candidate.toLowerCase() === key)
  if (matches.length === 1) return matches[0]          
  if (matches.length > 1) {
    throw new CorpusError('ambiguous-page-id', `pageId is ambiguous in this library: ${pageId}`)
  }
  throw new CorpusError('unknown-page', `no such page in this library: ${pageId}`)
}

                                  
                                                                               
                   
 

/**
 * Read one page from this snapshot. Never touches the disk: the snapshot is
 * the authority for the duration of a query/round.
 */
export function readPage(corpus                , pageId        , options                  = {})           {
  const canonical = resolvePageId(corpus, pageId)
  const page = corpus.pages.get(canonical)            
  if (options.revision !== undefined && options.revision !== page.contentHash) {
    throw new CorpusError(
      'version-mismatch',
      `page ${canonical} changed: expected ${options.revision}, found ${page.contentHash}`,
    )
  }
  return page
}

                               
                
               
                                                                 
                         
                    
                                          
               
 

                     
                                   
                                   
 

const adjacencyCache = new WeakMap                   ()

function adjacencyOf(corpus                )            {
  const cached = adjacencyCache.get(corpus                     )
  if (cached !== undefined) return cached
  const outgoing = new Map                    ()
  const incoming = new Map                    ()
  for (const edge of corpus.edges) {
    const outList = outgoing.get(edge.from)
    if (outList === undefined) outgoing.set(edge.from, [edge])
    else outList.push(edge)
    const inList = incoming.get(edge.to)
    if (inList === undefined) incoming.set(edge.to, [edge])
    else inList.push(edge)
  }
  const adjacency            = { outgoing, incoming }
  adjacencyCache.set(corpus                     , adjacency)
  return adjacency
}

/**
 * 0/1-hop canonical neighbours from the same link graph the retrieval expands.
 *
 * Order is deterministic: outgoing edges in document order, then incoming edges
 * sorted by source page id. Duplicates collapse onto the first edge seen.
 */
export function neighbors(corpus                , pageId        , hops       = 1)                 {
  const canonical = resolvePageId(corpus, pageId)
  if (hops === 0) return []
  const adjacency = adjacencyOf(corpus)
  const seen = new Set        ([canonical])
  const result                 = []
  const push = (edge          , direction              ) => {
    const otherId = direction === 'out' ? edge.to : edge.from
    if (seen.has(otherId)) return
    const other = corpus.pages.get(otherId)
    if (other === undefined) return
    seen.add(otherId)
    const node               = { pageId: otherId, title: other.title, direction, source: edge.source }
    if (edge.line !== undefined) node.line = edge.line
    result.push(node)
  }
  for (const edge of adjacency.outgoing.get(canonical) ?? []) push(edge, 'out')
  const incoming = [...(adjacency.incoming.get(canonical) ?? [])].sort((a, b) =>
    a.from < b.from ? -1 : a.from > b.from ? 1 : 0,
  )
  for (const edge of incoming) push(edge, 'in')
  return result
}

/** Versioned reference for a page, as it appears in reports and snapshots. */
export function toPageRef(page          )          {
  const ref          = { pageId: page.pageId, contentHash: page.contentHash }
  if (page.asOf !== undefined) ref.asOf = page.asOf
  return ref
}

/** All edges of the graph in the shape the RetrievalReport carries. */
export function reportEdges(corpus                , pageIds                   )                                                     {
  const wanted = new Set(pageIds)
  const seen = new Set        ()
  const result                                                     = []
  for (const edge of corpus.edges) {
    if (!wanted.has(edge.from) || !wanted.has(edge.to)) continue
    const key = `${edge.from}\u0000${edge.to}\u0000${edge.source}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push({ from: edge.from, to: edge.to, source: edge.source })
  }
  return result
}
