/** 手动优先账号的取值域：自动（跟随策略）/ 强制先主号 / 强制先备号。 */
export type AccountOverride = 'auto' | 'primary' | 'secondary'

/** 池内槽位顺序里允许出现的两个槽位名。 */
export type AccountSlot = 'primary' | 'secondary'

export declare const ACCOUNT_OVERRIDES: readonly AccountOverride[]
export declare const ACCOUNT_ROUTE_PATH: string
export declare const ACCOUNT_KEY_HEADER: string

/** 路由文档里描述池状态的最小结构（Host 半的 describe 回调返回值）。 */
export interface AccountDescribe {
  policy: string
  /** 备号**可用**（真能解析成另一个账号），不是「文件存在」。 */
  secondaryConfigured: boolean
  /** 备号不可用的具体原因，禁用态下悬停提示用。 */
  unavailableReason?: string
  /** 手动档没兑现的原因（只在手动档期间出现）。 */
  degraded?: { kind: string; message: string; at?: number }
}

/**
 * 路由返回给浏览器的完整文档。
 *
 * 刻意**不**继承 {@link AccountDescribe}：describe 回调的 `secondaryConfigured`
 * 在文档里换了名字叫 `available.secondary`，写成继承会让调用方按 d.ts 去读一个
 * 运行时不存在的字段（tsc 照过，运行时拿 undefined）。
 */
export interface AccountDocument {
  /** 本进程的写 key；POST 必须原样放进 ACCOUNT_KEY_HEADER。 */
  key: string
  override: AccountOverride
  updatedAt: number
  policy: string
  available: { primary: boolean; secondary: boolean }
  /** 备号不可用的具体原因（禁用态悬停提示）。 */
  unavailableReason?: string
  /** 手动档没兑现的原因（只在手动档期间出现）。 */
  degraded?: { kind: string; message: string; at?: number }
}

export declare function accountPreference(): AccountOverride
export declare function setAccountPreference(value: unknown): { override: AccountOverride; updatedAt: number }

/** 订阅手动档变更；返回取消订阅闭包。 */
export declare function onAccountPreferenceChange(
  listener: (override: AccountOverride, updatedAt: number) => void,
): () => void

/**
 * 把 override 叠到策略给出的顺序上：只重排、不造元素、不去重。
 * 选中项不在 order 里时原样返回。
 */
export declare function applyAccountOverride(
  order: AccountSlot[],
  override?: AccountOverride,
): AccountSlot[]

export declare function parseAccountAction(text: string): { account: AccountOverride } | undefined

export declare function accountRouteHandler(deps: {
  describe: () => AccountDescribe | Promise<AccountDescribe>
}): (req: unknown, res: unknown) => Promise<void>

export declare function registerAccountRoute(
  ctx: unknown,
  deps: { describe: () => AccountDescribe | Promise<AccountDescribe> },
  path?: string,
  onError?: (error: unknown) => void,
): void

/** 备用凭据文件是否存在（只判在不在，不判能不能用）。 */
export declare function secondaryConfiguredAt(path: unknown): boolean
