import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartEntry {
  name: string
  valuation: number
  flag: string
}

interface Props {
  currencyA: ChartEntry
  currencyB: ChartEntry
  crossAB: number | null
  useLiveRates: boolean
}

function getBarColor(value: number) {
  return value > 0 ? '#f87171' : '#34d399'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const value: number = entry.value
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-200">{entry.payload.flag} {entry.payload.name}</p>
      <p className={value > 0 ? 'text-red-400' : 'text-emerald-400'}>
        {value > 0 ? '+' : ''}{value.toFixed(2)}% {value > 0 ? 'overvalued' : 'undervalued'}
      </p>
    </div>
  )
}

export function ComparisonChart({ currencyA, currencyB, crossAB, useLiveRates }: Props) {
  const data: ChartEntry[] = [
    { name: currencyA.name, valuation: currencyA.valuation, flag: currencyA.flag },
    // Skip Currency B if it's exactly 0% (e.g. USD vs USD)
    ...(Math.abs(currencyB.valuation) >= 0.05
      ? [{ name: currencyB.name, valuation: currencyB.valuation, flag: currencyB.flag }]
      : []),
    ...(crossAB !== null
      ? [{ name: `${currencyA.name}/${currencyB.name}`, valuation: crossAB, flag: '↔' }]
      : []),
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderCustomLabel(props: any) {
    const { x, y, width, height, value, index } = props
    const flag = data[index]?.flag ?? ''
    const isPositive = value >= 0
    // Place label outside the bar tip: above for positive, below for negative
    const labelY = isPositive ? y - 8 : y + height - 8
    return (
      <text
        x={x + width / 2}
        y={labelY}
        textAnchor="middle"
        className="fill-slate-400 text-[11px]"
        fontSize={11}
        fill="#94a3b8"
      >
        {flag} {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </text>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Valuation vs USD {useLiveRates ? '· live rates' : '· survey rates'}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-emerald-400" /> undervalued</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-red-400" /> overvalued</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
          <Bar dataKey="valuation" radius={[6, 6, 0, 0]} label={renderCustomLabel}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.valuation)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
