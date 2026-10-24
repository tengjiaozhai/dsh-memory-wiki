import type { Context } from '@deepseek-ai/cordis'

export declare const name: 'llm-workbuddy'
export declare const inject: readonly string[]
export declare const Config: unknown
export declare function apply(ctx: Context, config: unknown): void
export declare function rewriteBrandTokens(bodyJson: unknown): unknown
export declare function installBrandRewrite(): boolean
