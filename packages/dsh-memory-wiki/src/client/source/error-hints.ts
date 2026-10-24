/**
 * Business error codes → what the user can actually do.
 *
 * The contract returns errors as data (`value.error`), not exceptions, so the
 * panel must translate every code instead of showing "call failed".
 */
const HINTS: Record<string, string> = {
  'wiki-unavailable': '暂时无法读取 Wiki：请检查插件中的 wikiRoot 设置后重试。',
  'unknown-session': '会话已不存在或无权访问：请重新打开一个会话，本面板不会自行创建。',
  // B10: never claim a refresh is happening — the panel deliberately waits for
  // the user to press the button. B11: this code only ever comes from a WRITE,
  // so the sentence says the view is stale, not that a read failed.
  'stale-revision': '视图已过期：点按钮读取服务端最新视图，确认当前选择后再操作。',
  'library-changed': '知识库在准备之后变更了：请重新预览再准备（旧选择不会自动沿用）。',
  'nothing-selected': '当前没有选中任何页面：先从候选里选入，或等自动检索结果。',
  'unknown-page': '页面不在当前知识库里：可能已被删除或改名。',
  'page-version-mismatch': '页面内容在准备之后变了：请重新预览，不要沿用旧快照。',
  'manual-over-budget': '手选超出额度：扩大额度或减少页面，客户端不会替你截断。',
  'no-usable-block': '所选页面没有可用的完整块：换一页，或缩小到有正文片段的部分。',
}

export function hintFor(code: string | undefined, fallback: string): string {
  if (code === undefined) return fallback
  return HINTS[code] ?? fallback
}

export function describeBusinessError(error: unknown): string {
  if (error === null || typeof error !== 'object') return '服务端返回错误，但格式无法识别。'
  const record = error as { code?: unknown }
  const code = typeof record.code === 'string' ? record.code : undefined
  return hintFor(code, '服务端返回未知错误' + (code === undefined ? '' : '（' + code + '）'))
}
