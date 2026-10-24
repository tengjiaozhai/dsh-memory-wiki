// 由 scripts/vendor-upstream.mjs 生成，请勿手改。
//
// 上游没有对外导出 atRestKeyProviderFor，但备用账号的凭据文件也是 WorkBuddy 5.6 的
// 加密信封，必须用同一套 discovery 才能解出 at-rest 密钥。这里按上游当前的导出
// 别名把它转出来；上游改结构时 vendor 阶段会直接报错。
export { b as atRestKeyProviderFor } from './host-heartbeat-SJaZ33tR.js'
