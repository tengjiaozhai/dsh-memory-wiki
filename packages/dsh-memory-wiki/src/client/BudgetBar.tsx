import type { CompileResult, BudgetChars } from '../core/types.js'
import type { BudgetOption, SelectionKind } from './source/types.js'

const format = (value: number) => value.toLocaleString('zh-CN')

const SELECTIONS: SelectionKind[] = ['auto1', 'auto0', 'manual']

export const SELECTION_TEXT: Record<SelectionKind, string> = {
  auto1: '自动 · 1 跳',
  auto0: '仅直接命中',
  manual: '手选 4 页',
}

export function BudgetBar(props: {
  result: CompileResult
  budget: BudgetOption
  selection: SelectionKind
  onBudget(next: BudgetOption): void
  onSelection(next: SelectionKind): void
}) {
  const { result, budget, selection, onBudget, onSelection } = props
  const pct = Math.min((result.chars / budget) * 100, 100)
  return (
    <div className="memory-wiki-panel__budget" data-testid="mw-budget">
      <div className="memory-wiki-panel__toolbar">
        <div className="memory-wiki-panel__seg" role="group" aria-label="选区">
          {SELECTIONS.map((kind) => (
            <button
              key={kind}
              type="button"
              className={selection === kind ? 'is-current' : ''}
              aria-pressed={selection === kind}
              data-testid={'mw-sel-' + kind}
              onClick={() => onSelection(kind)}
            >
              {SELECTION_TEXT[kind]}
            </button>
          ))}
        </div>
        <div className="memory-wiki-panel__seg" role="group" aria-label="字符额度">
          {([4000, 8000] as BudgetChars[]).map((option) => (
            <button
              key={option}
              type="button"
              className={budget === option ? 'is-current' : ''}
              aria-pressed={budget === option}
              data-testid={'mw-budget-' + option}
              onClick={() => onBudget(option)}
            >
              {format(option)}
            </button>
          ))}
        </div>
      </div>
      <div className="memory-wiki-panel__meter-line">
        <span data-testid="mw-chars">
          {format(result.chars)} / {format(budget)} 字符
        </span>
        <span
          className={'memory-wiki-panel__meter' + (result.fits ? '' : ' is-over')}
          role="meter"
          aria-valuemin={0}
          aria-valuemax={budget}
          aria-valuenow={Math.min(result.chars, budget)}
          aria-valuetext={format(result.chars) + ' 字符，上限 ' + format(budget)}
        >
          <span style={{ width: pct + '%' }} />
        </span>
        <span data-testid="mw-fit">{result.fits ? '额度内' : '超额'}</span>
      </div>
      {!result.fits && (
        <p className="memory-wiki-panel__over" role="alert" data-testid="mw-over">
          超出 {format(result.overBy)} 字符：手选不截断、不丢页，要么扩到 8,000，要么减少选取。
        </p>
      )}
    </div>
  )
}
