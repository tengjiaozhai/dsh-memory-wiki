import type { Context } from '@deepseek-ai/cordis'
import type { AccountOverride } from './lib/account-pool.js'

export declare const name: 'llm-workbuddy'
export declare const inject: readonly string[]
export declare const Config: unknown
/** 上游 apply 的返回值原样透出（cordis 不依赖它，但别声明成 void）。 */
export declare function apply(ctx: Context, config: unknown): unknown

/** 请求体里的品牌串替换：DeepSeek Harness → WorkBuddy。 */
export declare function rewriteBrandTokens(bodyJson: unknown): unknown
/** 替换对（brand → workbuddy），供测试与排错。是实现里的 from/to 对象，不是元组。 */
export declare function rewritePairs(): Array<{ from: string; to: string }>
/** 给凭据挂一个可读的账号标签（额度卡片前缀用）。 */
export declare function accountLabel(credential: unknown): string
/** 把主备两份额度快照合并成一张卡片的数据。 */
export declare function mergeCredits(
  primary: unknown,
  secondary: unknown,
  primaryLabel: string,
  secondaryLabel: string,
): unknown
/** 给 chatStream 打双账号 + 品牌改写补丁；幂等，返回本次是否真的打了。 */
export declare function installChatPipeline(): boolean

/**
 * 备用账号可用性：真解析一次再判，只读不刷新。
 * 结果按「文件大小+修改时间」缓存 AVAILABILITY_TTL_MS（15s）。
 */
export declare function secondaryAvailability(
  authPath: string,
): Promise<{ configured: boolean; usable: boolean; reason?: string }>

/** 当前账号池状态快照（只读，含手动优先档位与降级原因）。 */
export declare function accountPoolStatus(): {
  policy: 'off' | 'failover' | 'rotate'
  /** 槽位文件在不在（不等于是不是能用）。 */
  secondarySlot: boolean
  /** 最近一次真解析的结论；undefined 表示还没探测过或文件已变。 */
  secondaryUsable: boolean | undefined
  secondaryPath: string | undefined
  preferred: 'primary' | 'secondary'
  switchedAt: number
  override: AccountOverride
  degraded?: { kind: string; message: string; at?: number }
  /** 切号路由挂载失败过（卡片上不会有控件，日志里有 warn）。 */
  routeFailed: boolean
}

/** 读写手动优先账号；不传参数时只读。 */
export declare function accountSwitch(value?: AccountOverride): ReturnType<typeof accountPoolStatus>
