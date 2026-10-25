import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { assertSafePageId } from '../../core/wiki-corpus.js'

export const hash = (value: string) => crypto.createHash('sha256').update(value).digest('hex')
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())

export class PublicationConflict extends Error {
  partial = true
}

export function redact(text: string): string {
  return text.replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g, '[REDACTED PRIVATE KEY]')
    .replace(/\bapikey_[A-Za-z0-9_]+/g, '[REDACTED]')
    .replace(/\buser_[A-Za-z0-9_-]{40,}/g, '[REDACTED]')
    .replace(/\bsk-[A-Za-z0-9_-]{12,}/g, '[REDACTED]')
    .replace(/(Bearer\s+)[A-Za-z0-9._~+\/-]+/gi, '$1[REDACTED]')
    .replace(/(["']?(?:(?:[A-Za-z][A-Za-z0-9]*[_-])*(?:api[_-]?key|token|access[_-]?token|refresh[_-]?token|password|secret|authorization|cookie|client[_-]?secret))["']?\s*[=:]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s,"'}]+)/gi, '$1"[REDACTED]"')
}

export function safeError(error: unknown): string {
  return redact(error instanceof Error ? error.message : String(error)).slice(0, 500)
}

/** Redact structured fields before JSON serialization can escape their keys. */
export function redactRecord(value: unknown): unknown {
  if (typeof value === 'string') return redact(value)
  if (Array.isArray(value)) return value.map(redactRecord)
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key,
    /(?:^|[_-])(?:api[_-]?key|token|password|secret|authorization|cookie|credentials?|private[_-]?key)$|^(?:apikey|accesstoken|refreshtoken|clientsecret|privatekey)$/i.test(key) ? '[REDACTED]' : redactRecord(entry),
  ]))
  return value
}

/** Reject symlinks at every existing path component, including the final file. */
export function under(root: string, relative: string): string {
  assertSafePageId(relative)
  let current = root
  for (const segment of relative.split('/')) {
    current = path.join(current, segment)
    try {
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Symbolic links are not writable capture paths')
    }
    catch (error: any) { if (error.code !== 'ENOENT') throw error }
  }
  return current
}

export function atomicWrite(file: string, text: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temporary = `${file}.${crypto.randomUUID()}.tmp`
  const fd = fs.openSync(temporary, 'wx', 0o600)
  try { fs.writeFileSync(fd, text); fs.fsyncSync(fd) }
  finally { fs.closeSync(fd) }
  try { fs.renameSync(temporary, file) }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary) }
  const directory = fs.openSync(path.dirname(file), 'r')
  try { fs.fsyncSync(directory) }
  finally { fs.closeSync(directory) }
}

export function readOptional(file: string): string | null {
  try { return fs.readFileSync(file, 'utf8') }
  catch (error: any) { if (error.code === 'ENOENT') return null; throw error }
}

/** Preserve the exact displaced inode, then create the replacement exclusively.
 * Unlike rename-overwrite, an intervening external save is never overwritten.
 * A crash between displacement and creation is resumed from the manifest.
 */
export function installVersion(root: string, jobId: string, relative: string, before: string | null, after: string): void {
  const target = under(root, relative)
  const displaced = under(root, `.dsh-memory-wiki-publish/${jobId}/${hash(relative)}.before`)
  const current = readOptional(target)
  if (current === after) return
  if (current !== before && !(current === null && readOptional(displaced) === before)) throw new PublicationConflict(`External edit at ${relative}; original versions were preserved`)
  if (current !== null) {
    if (fs.existsSync(displaced)) throw new PublicationConflict(`A displaced version already exists for ${relative}; inspect preserved versions`)
    fs.mkdirSync(path.dirname(displaced), { recursive: true, mode: 0o700 })
    fs.renameSync(target, displaced)
    if (readOptional(displaced) !== before) {
      try { fs.linkSync(displaced, target) } catch (error: any) { if (error.code !== 'EEXIST') throw error }
      throw new PublicationConflict(`External edit detected while displacing ${relative}; preserved original was not overwritten`)
    }
  }
  fs.mkdirSync(path.dirname(target), { recursive: true })
  const temporary = `${target}.${crypto.randomUUID()}.tmp`
  atomicWrite(temporary, after)
  try { fs.linkSync(temporary, target) }
  catch (error: any) {
    if (error.code === 'EEXIST') throw new PublicationConflict(`External save at ${relative}; both versions were preserved`)
    throw error
  }
  finally { fs.unlinkSync(temporary) }
  const directory = fs.openSync(path.dirname(target), 'r')
  try { fs.fsyncSync(directory) }
  finally { fs.closeSync(directory) }
}
