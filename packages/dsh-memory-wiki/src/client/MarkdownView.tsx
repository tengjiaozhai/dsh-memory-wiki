import { Fragment, type ReactNode } from 'react'
import { splitBlocks } from '../core/markdown.js'
import type { MarkdownBlock } from '../core/types.js'

/**
 * Markdown surface for the panel.
 *
 * Renders blocks produced by `core/markdown.ts` — the plugin's single parser
 * (design §4.2) — instead of pulling a second Markdown pipeline into the client
 * bundle. A GFM pipeline (react-markdown + remark-gfm) was tried first and
 * could not load: `react-markdown -> vfile` needs `node:path` and
 * `node:process`, which the host module table does not provide, and the client
 * build config is not mine to alias. What the wiki actually contains (headings,
 * paragraphs, lists, tables, fenced code, quotes, wikilinks, inline code/bold)
 * is covered here; anything unsupported falls back to verbatim text, never to
 * silently dropped content.
 */

const INLINE = /\*\*([^*]+)\*\*|`([^`]+)`|\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\[([^\]]+)\]\(([^)]+)\)/g

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  INLINE.lastIndex = 0
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const keyValue = 'i' + key++
    if (match[1] !== undefined) out.push(<strong key={keyValue}>{match[1]}</strong>)
    else if (match[2] !== undefined) out.push(<code key={keyValue}>{match[2]}</code>)
    else if (match[3] !== undefined) {
      out.push(
        <span key={keyValue} className="memory-wiki-panel__wikilink" title={match[3]}>
          {match[4] ?? match[3]}
        </span>,
      )
    } else if (match[5] !== undefined && match[6] !== undefined) {
      out.push(
        <a key={keyValue} href={match[6]} target="_blank" rel="noreferrer noopener">
          {match[5]}
        </a>,
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return trimmed.split('|').map((cell) => cell.trim())
}

function renderTable(block: MarkdownBlock): ReactNode {
  const rows = block.text.split('\n').filter((line) => line.trim().startsWith('|'))
  if (rows.length === 0) return <pre className="memory-wiki-panel__md-fallback">{block.text}</pre>
  const header = splitRow(rows[0] ?? '')
  // Drop the GFM delimiter row (|---|---|) — it is markup, not data.
  const isDelimiter = (line: string) => splitRow(line).every((cell) => /^:?-{1,}:?$/.test(cell))
  const bodyRows = rows.slice(1).filter((line) => !isDelimiter(line))
  return (
    <table>
      <thead>
        <tr>
          {header.map((cell, index) => (
            <th key={index}>{inline(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((line, rowIndex) => (
          <tr key={rowIndex}>
            {splitRow(line).map((cell, cellIndex) => (
              <td key={cellIndex}>{inline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function renderList(block: MarkdownBlock): ReactNode {
  const lines = block.text.split('\n').filter((line) => line.trim().length > 0)
  const ordered = /^\s*\d+[.)]\s/.test(lines[0] ?? '')
  const items = lines.map((line) => line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, ''))
  const children = items.map((item, index) => <li key={index}>{inline(item)}</li>)
  return ordered ? <ol>{children}</ol> : <ul>{children}</ul>
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  const key = 'b' + index
  switch (block.kind) {
    case 'heading': {
      const level = Math.min(Math.max(block.level ?? 2, 1), 4)
      const Tag = ('h' + level) as 'h1' | 'h2' | 'h3' | 'h4'
      return <Tag key={key}>{inline(block.text.replace(/^#+\s*/, ''))}</Tag>
    }
    case 'paragraph':
      return <p key={key}>{inline(block.text.replace(/\n+/g, ' '))}</p>
    case 'list':
      return <Fragment key={key}>{renderList(block)}</Fragment>
    case 'table':
      return <Fragment key={key}>{renderTable(block)}</Fragment>
    case 'code': {
      const body = block.text.replace(/^\s*```[^\n]*\n?/, '').replace(/\n?```\s*$/, '')
      return (
        <pre key={key}>
          <code>{body}</code>
        </pre>
      )
    }
    case 'quote':
      return <blockquote key={key}>{inline(block.text.replace(/^>\s?/gm, ''))}</blockquote>
    case 'hr':
      return <hr key={key} />
    default:
      return (
        <pre key={key} className="memory-wiki-panel__md-fallback">
          {block.text}
        </pre>
      )
  }
}

export function MarkdownView(props: { source: string; compact?: boolean; testId?: string; title?: string }) {
  const parsed = splitBlocks(props.source, 1)
  const first = parsed[0]
  const blocks = props.title !== undefined && first?.kind === 'heading' && first.text.replace(/^#+\s*/, '').trim() === props.title
    ? parsed.slice(1) : parsed
  return (
    <div
      className={'memory-wiki-panel__md' + (props.compact === true ? ' is-compact' : '')}
      data-testid={props.testId ?? 'mw-md'}
      data-blocks={blocks.length}
    >
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
