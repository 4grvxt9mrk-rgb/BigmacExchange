import type { BigMacEntry } from '../lib/bigmac'
import { getFlag } from '../lib/flags'

interface Props {
  label: string
  value: string
  onChange: (code: string) => void
  entries: BigMacEntry[]
}

export function CurrencySelector({ label, value, onChange, entries }: Props) {
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name))
  const selected = entries.find((e) => e.currency_code === value)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xl"
          aria-hidden
        >
          {selected ? getFlag(selected.iso_a3) : '🌐'}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-10 text-sm font-medium text-white shadow-sm transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none cursor-pointer"
          style={{ borderColor: value ? undefined : undefined }}
        >
          {sorted.map((entry) => (
            <option key={entry.currency_code} value={entry.currency_code}>
              {getFlag(entry.iso_a3)} {entry.name} ({entry.currency_code})
            </option>
          ))}
        </select>
        <div
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          aria-hidden
        >
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {selected && (
        <p className="text-xs text-slate-500">
          Big Mac: {selected.currency_code} {selected.local_price.toFixed(2)} · Survey: {selected.date}
        </p>
      )}
    </div>
  )
}
