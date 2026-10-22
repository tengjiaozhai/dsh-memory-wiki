/**
 * core/markdown.ts — the single Markdown/frontmatter parser of this plugin.
 *
 * Design §4.2: the plugin keeps exactly one parsing entry point; it must not
 * grow a second loose string parser next to the Wiki's own tooling. Everything
 * else (corpus, retrieval, compiler, tools) consumes this module.
 *
 * Scope: a deliberately small YAML subset (flat scalars, inline lists, block
 * lists) which is what the target library actually uses, plus a Markdown block
 * splitter whose only hard rule is "never cut a fenced code block or a table".
 */
import type { BlockKind, FrontmatterValue, MarkdownBlock, RawLink } from './types.js'

export interface FrontmatterResult {
  ok: boolean
  /** Parsed flat key -> scalar/list map. Empty when there is no frontmatter. */
  value: Record<string, FrontmatterValue>
  /** 1-based file line of the first body line. */
  bodyStartLine: number
  body: string
  totalLines: number
  error?: string
}

/** Count lines of a text the way the file stores them (trailing newline adds no line). */
export function countLines(text: string): number {
  if (text.length === 0) return 0
  const normalized = text.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
  return lines.length
}

/** Split into lines, dropping a single trailing empty line produced by a final newline. */
export function toLines(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
  return lines
}

function stripQuotes(raw: string): string {
  const value = raw.trim()
  if (value.length >= 2) {
    const first = value[0]
    const last = value[value.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1)
    }
  }
  return value
}

/**
 * Strip trailing ` # comment` from an unquoted scalar. The target library never
 * relies on this, but a stray comment must not become part of a title.
 */
function stripComment(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) return trimmed
  const at = trimmed.search(/\s#/)
  return at === -1 ? trimmed : trimmed.slice(0, at).trim()
}

/** Split an inline YAML list `[a, "b", c]` into items. */
function parseInlineList(raw: string): string[] {
  const inner = raw.trim().slice(1, -1)
  const items: string[] = []
  let current = ''
  let quote: string | null = null
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i] as string
    if (quote) {
      if (ch === quote) quote = null
      current += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      current += ch
      continue
    }
    if (ch === ',') {
      items.push(current)
      current = ''
      continue
    }
    current += ch
  }
  if (current.trim().length > 0 || items.length > 0) items.push(current)
  return items.map((item) => stripQuotes(stripComment(item))).filter((item) => item.length > 0)
}

function parseScalarOrList(raw: string): FrontmatterValue {
  const trimmed = raw.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return parseInlineList(trimmed)
  return stripQuotes(stripComment(trimmed))
}

/**
 * Parse a leading YAML frontmatter block.
 *
 * Line accounting rule (design §5.2 "来源行段使用原文件的一基行号，计入
 * frontmatter 所占行"): bodyStartLine is the 1-based file line of the first
 * body line, i.e. the line right after the closing `---`.
 */
export function parseFrontmatter(raw: string): FrontmatterResult {
  const lines = toLines(raw)
  const totalLines = lines.length
  const first = lines.length > 0 ? (lines[0] as string).trim() : ''
  if (first !== '---') {
    return { ok: false, value: {}, bodyStartLine: 1, body: lines.join('\n'), totalLines, error: 'no-frontmatter' }
  }
  let closeIndex = -1
  for (let i = 1; i < lines.length; i += 1) {
    const line = (lines[i] as string).trim()
    if (line === '---' || line === '...') {
      closeIndex = i
      break
    }
  }
  if (closeIndex === -1) {
    return { ok: false, value: {}, bodyStartLine: 1, body: lines.join('\n'), totalLines, error: 'unterminated-frontmatter' }
  }

  const value: Record<string, FrontmatterValue> = {}
  let pendingKey: string | null = null
  let blockList: string[] = []
  const flush = () => {
    if (pendingKey !== null && blockList.length > 0) value[pendingKey] = blockList
    pendingKey = null
    blockList = []
  }

  for (let i = 1; i < closeIndex; i += 1) {
    const line = lines[i] as string
    if (line.trim().length === 0) continue
    const itemMatch = /^\s*-\s+(.*)$/.exec(line)
    if (itemMatch) {
      if (pendingKey !== null) blockList.push(stripQuotes(stripComment(itemMatch[1] as string)))
      continue
    }
    const keyMatch = /^([A-Za-z_][A-Za-z0-9_-]*):(?:\s*(.*))?$/.exec(line)
    if (!keyMatch) continue
    flush()
    const key = keyMatch[1] as string
    const rest = (keyMatch[2] ?? '').trim()
    if (rest.length === 0) {
      pendingKey = key
      continue
    }
    value[key] = parseScalarOrList(rest)
  }
  flush()

  const bodyLines = lines.slice(closeIndex + 1)
  const bodyStartLine = closeIndex + 2
  return { ok: true, value, bodyStartLine, body: bodyLines.join('\n'), totalLines }
}

/** Replace the content of inline code spans with spaces, keeping column positions. */
export function maskInlineCode(line: string): string {
  const chars = line.split('')
  let i = 0
  while (i < chars.length) {
    if (chars[i] !== '`') {
      i += 1
      continue
    }
    let run = 0
    while (i + run < chars.length && chars[i + run] === '`') run += 1
    const fence = '`'.repeat(run)
    const end = line.indexOf(fence, i + run)
    if (end === -1) {
      i += run
      continue
    }
    for (let k = i; k < end + run; k += 1) chars[k] = ' '
    i = end + run
  }
  return chars.join('')
}

const FENCE_RE = /^\s*(`{3,}|~{3,})(.*)$/
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/
const HR_RE = /^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/
const TABLE_RE = /^\s*\|/
const QUOTE_RE = /^\s{0,3}>/
const LIST_RE = /^\s*(?:[-*+]|\d{1,9}[.)])\s+/
const HTML_RE = /^\s*<([A-Za-z][A-Za-z0-9-]*)/

/**
 * Split a page body into atomic Markdown blocks.
 *
 * Atomic means: a fenced code block is one block, a table is one block, a
 * heading is its own block. The compiler may drop a whole block but must never
 * hand the model half a fence or half a table (design §5.2).
 */
export function splitBlocks(body: string, bodyStartLine: number): MarkdownBlock[] {
  const lines = toLines(body)
  const blocks: MarkdownBlock[] = []
  const headingStack: { level: number; text: string }[] = []

  const currentPath = (): string[] => headingStack.map((entry) => entry.text)

  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    if (line.trim().length === 0) {
      i += 1
      continue
    }

    const startIndex = i
    const fence = FENCE_RE.exec(line)
    if (fence) {
      const marker = fence[1] as string
      const markerChar = marker[0]
      let j = i + 1
      while (j < lines.length) {
        const candidate = (lines[j] as string).trim()
        // A closing fence is nothing but the marker character, at least as long
        // as the opener. Anything else inside the fence stays inside the block.
        const isClosingFence =
          candidate.length >= marker.length &&
          candidate.split('').every((ch) => ch === markerChar)
        if (isClosingFence) {
          j += 1
          break
        }
        j += 1
      }
      const text = lines.slice(startIndex, j).join('\n')
      blocks.push({
        kind: 'code',
        startLine: bodyStartLine + startIndex,
        endLine: bodyStartLine + j - 1,
        headingPath: currentPath(),
        text,
      })
      i = j
      continue
    }

    const heading = HEADING_RE.exec(line)
    if (heading) {
      const level = (heading[1] as string).length
      const text = (heading[2] as string).trim()
      while (headingStack.length > 0 && (headingStack[headingStack.length - 1] as { level: number }).level >= level) {
        headingStack.pop()
      }
      blocks.push({
        kind: 'heading',
        level,
        startLine: bodyStartLine + i,
        endLine: bodyStartLine + i,
        headingPath: currentPath(),
        text: line,
      })
      headingStack.push({ level, text })
      i += 1
      continue
    }

    if (HR_RE.test(line)) {
      blocks.push({
        kind: 'hr',
        startLine: bodyStartLine + i,
        endLine: bodyStartLine + i,
        headingPath: currentPath(),
        text: line,
      })
      i += 1
      continue
    }

    if (TABLE_RE.test(line)) {
      let j = i
      while (j < lines.length && TABLE_RE.test(lines[j] as string)) j += 1
      blocks.push({
        kind: 'table',
        startLine: bodyStartLine + i,
        endLine: bodyStartLine + j - 1,
        headingPath: currentPath(),
        text: lines.slice(i, j).join('\n'),
      })
      i = j
      continue
    }

    if (QUOTE_RE.test(line)) {
      let j = i
      while (j < lines.length && QUOTE_RE.test(lines[j] as string)) j += 1
      blocks.push({
        kind: 'quote',
        startLine: bodyStartLine + i,
        endLine: bodyStartLine + j - 1,
        headingPath: currentPath(),
        text: lines.slice(i, j).join('\n'),
      })
      i = j
      continue
    }

    if (LIST_RE.test(line)) {
      let j = i
      while (j < lines.length) {
        const candidate = lines[j] as string
        if (candidate.trim().length === 0) break
        if (LIST_RE.test(candidate) || /^\s{2,}\S/.test(candidate)) {
          j += 1
          continue
        }
        break
      }
      blocks.push({
        kind: 'list',
        startLine: bodyStartLine + i,
        endLine: bodyStartLine + j - 1,
        headingPath: currentPath(),
        text: lines.slice(i, j).join('\n'),
      })
      i = j
      continue
    }

    if (HTML_RE.test(line)) {
      let j = i
      while (j < lines.length && (lines[j] as string).trim().length > 0) j += 1
      blocks.push({
        kind: 'html',
        startLine: bodyStartLine + i,
        endLine: bodyStartLine + j - 1,
        headingPath: currentPath(),
        text: lines.slice(i, j).join('\n'),
      })
      i = j
      continue
    }

    let j = i
    while (j < lines.length) {
      const candidate = lines[j] as string
      if (candidate.trim().length === 0) break
      if (j > i && (FENCE_RE.test(candidate) || HEADING_RE.test(candidate) || HR_RE.test(candidate) || TABLE_RE.test(candidate) || QUOTE_RE.test(candidate) || LIST_RE.test(candidate) || HTML_RE.test(candidate))) break
      j += 1
    }
    blocks.push({
      kind: 'paragraph',
      startLine: bodyStartLine + i,
      endLine: bodyStartLine + j - 1,
      headingPath: currentPath(),
      text: lines.slice(i, j).join('\n'),
    })
    i = j
  }

  return blocks
}

const WIKILINK_RE = /\[\[([^\[\]]+)\]\]/g

/**
 * Split the inside of a `[[...]]` into target and alias.
 *
 * Handles Obsidian/GitHub tables, where the alias separator is written `\|`
 * (the target then carries a stray trailing backslash that must be dropped).
 */
export function splitWikilink(inner: string): { target: string; alias?: string } {
  const pipeAt = inner.indexOf('|')
  if (pipeAt === -1) {
    return { target: normalizeLinkTarget(inner) }
  }
  const rawTarget = inner.slice(0, pipeAt).replace(/\\+$/, '')
  const alias = inner.slice(pipeAt + 1).trim()
  const result: { target: string; alias?: string } = { target: normalizeLinkTarget(rawTarget) }
  if (alias.length > 0) result.alias = alias
  return result
}

/** Drop anchor, `.md` suffix and surrounding whitespace from a link target. */
export function normalizeLinkTarget(raw: string): string {
  let target = raw.trim()
  if (target.length === 0) return ''
  const hashAt = target.indexOf('#')
  if (hashAt >= 0) target = target.slice(0, hashAt)
  target = target.trim().replace(/\.md$/i, '').trim()
  return target
}

/**
 * Collect body wikilinks with their 1-based file line numbers.
 *
 * Links inside fenced code blocks and inside inline code spans are prose, not
 * edges: with inline code, writing `[[wikilink]]` inside backticks is
 * documentation *about* wikilinks and must not become a graph edge.
 */
export function parseRawLinks(blocks: readonly MarkdownBlock[]): RawLink[] {
  const links: RawLink[] = []
  for (const block of blocks) {
    if (block.kind === 'code') continue
    const blockLines = block.text.split('\n')
    for (let offset = 0; offset < blockLines.length; offset += 1) {
      const masked = maskInlineCode(blockLines[offset] as string)
      WIKILINK_RE.lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = WIKILINK_RE.exec(masked)) !== null) {
        const parsed = splitWikilink(match[1] as string)
        if (parsed.target.length === 0) continue
        const link: RawLink = { target: parsed.target, line: block.startLine + offset, source: 'body' }
        if (parsed.alias !== undefined) link.alias = parsed.alias
        links.push(link)
      }
    }
  }
  return links
}

/** Block kinds that are pure structure and never count as evidence on their own. */
export function isStructuralBlock(kind: BlockKind): boolean {
  return kind === 'heading' || kind === 'hr'
}
