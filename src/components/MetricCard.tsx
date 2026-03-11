interface Props {
  title: string
  valuationPct: number | null
  bigMacUsd: number
  localPrice: number
  currencyCode: string
  localCurrencyCode?: string // for cross-rate card: the A currency code to label local price
  surveyRate: number
  liveRate: number | null
  impliedRate: number
  flag: string
  countryName: string
  isCross?: boolean
  crossLabel?: string
}

function ValuationBadge({ pct }: { pct: number }) {
  const isOver = pct > 0
  const abs = Math.abs(pct).toFixed(1)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isOver
          ? 'bg-red-500/15 text-red-400'
          : 'bg-emerald-500/15 text-emerald-400'
      }`}
    >
      {isOver ? '▲' : '▼'} {abs}% {isOver ? 'overvalued' : 'undervalued'}
    </span>
  )
}

export function MetricCard({
  title,
  valuationPct,
  bigMacUsd,
  localPrice,
  currencyCode,
  localCurrencyCode,
  surveyRate,
  liveRate,
  impliedRate,
  flag,
  countryName,
  isCross = false,
  crossLabel,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-200">
            {flag} {countryName}
            {crossLabel && <span className="text-slate-400"> {crossLabel}</span>}
          </p>
        </div>
        {valuationPct !== null && <ValuationBadge pct={valuationPct} />}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {!isCross && (
          <Row label="Big Mac price" value={`$${bigMacUsd.toFixed(2)} USD`} />
        )}
        {isCross && (
          <Row
            label="Big Mac in local"
            value={`${localCurrencyCode ?? currencyCode} ${localPrice.toFixed(2)}`}
          />
        )}
        <Row
          label="Actual rate"
          value={
            liveRate !== null
              ? `${liveRate.toFixed(4)} (live)`
              : `${surveyRate.toFixed(4)} (survey)`
          }
          highlight={liveRate !== null}
        />
        <Row label="Implied PPP rate" value={impliedRate.toFixed(4)} />
        {liveRate !== null && (
          <Row label="Survey rate" value={surveyRate.toFixed(4)} dim />
        )}
      </div>

      {valuationPct !== null && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className={`h-full rounded-full transition-all ${
              valuationPct > 0 ? 'bg-red-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(Math.abs(valuationPct), 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
  dim,
}: {
  label: string
  value: string
  highlight?: boolean
  dim?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`${dim ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
      <span
        className={`font-mono text-xs font-medium ${
          highlight ? 'text-amber-400' : dim ? 'text-slate-500' : 'text-slate-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
