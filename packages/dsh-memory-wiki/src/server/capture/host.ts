import fs from 'node:fs'
import path from 'node:path'
import { dshHomePath } from '@deepseek-ai/dsh-home-paths'
import { BlockAssembler } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions } from '@deepseek-ai/dsh-llm'
import { ExperienceCapture } from './experience.js'
import { JevJudge } from './jev.js'
import { WikiIngest } from './ingest.js'
import { hash, safeError } from './files.js'
import type { GenerateWiki } from './ingest.js'

export type CaptureConfig = { enabled: boolean; judgeModel: string; skillPath: string }

/** Independent one-shot model request: an empty tool set is a permission limit. */
export function createWikiWriter(llm: { stream(options: GenerateOptions): AsyncIterable<any> }): GenerateWiki {
  return async (input, route, signal) => {
    const assembler = new BlockAssembler()
    let finished = false
    for await (const chunk of llm.stream({ ...route, reasoningEffort: route.reasoningEffort as GenerateOptions['reasoningEffort'],
      system: input.instructions, messages: [{ role: 'user', content: [{ type: 'text', text: JSON.stringify({ evidence: input.evidence, pages: input.pages, sourceRef: input.sourceRef }) }] }],
      tools: [], maxTokens: 16_000, signal })) {
      if (finished) throw new Error('Wiki writer emitted data after finish')
      assembler.push(chunk)
      if (chunk.type === 'finish') {
        finished = true
        if (chunk.reason.kind !== 'stop') throw new Error(`Wiki writer did not finish successfully: ${chunk.reason.kind}`)
      }
    }
    if (!finished) throw new Error('Wiki writer emitted no finish')
    const blocks = assembler.blocks()
    const texts = blocks.filter(block => block.type === 'text')
    if (texts.length !== 1 || blocks.some(block => block.type !== 'text' && block.type !== 'reasoning')) throw new Error('Wiki writer output must be a single JSON text, without tools')
    return JSON.parse(texts[0]!.text)
  }
}

export function createHostCapture(ctx: any, wikiRoot: string, config: CaptureConfig, callbacks: { publishing(active: boolean): void; published(): void }): ExperienceCapture {
  if (!config.skillPath) throw new Error('请配置 llm-wiki 的 skillPath')
  const keyFile = dshHomePath('credentials', 'memory-wiki-typesafe.key')
  const apiKey = process.env.TYPESAFE_API_KEY?.trim() || (fs.existsSync(keyFile) ? fs.readFileSync(keyFile, 'utf8').trim() : '')
  if (!apiKey) throw new Error('Jev 未配置：请设置 TYPESAFE_API_KEY 或本地私有凭据文件')
  if (!/^jev-\d+\.\d+\.\d+$/.test(config.judgeModel)) throw new Error('Jev 必须使用固定版本模型 ID')
  const dataRoot = dshHomePath('storages', 'memory-wiki-auto-capture', hash(fs.realpathSync(wikiRoot)))
  const judge = new JevJudge({ apiKey, model: config.judgeModel })
  const ingest = new WikiIngest({ wikiRoot, dataRoot, skillPath: path.resolve(config.skillPath), generate: createWikiWriter(ctx.llm) })
  return new ExperienceCapture({ wikiRoot, dataRoot, judge, ingest,
    readEvents: async sessionId => (await ctx.sessionQuery.readSession(sessionId)).events,
    onPublishing: callbacks.publishing, onPublished: callbacks.published,
    onError: message => ctx.logger?.warn?.(`memory-wiki capture: ${safeError(message)}`),
  })
}
