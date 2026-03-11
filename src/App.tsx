import { useEffect, useState } from 'react'
import { fetchBigMacData, type BigMacEntry } from './lib/bigmac'
import { fetchLiveRates, getLiveRate } from './lib/exchangeRates'
import { computeValuation, computeCrossValuation } from './lib/calculations'
import { getFlag } from './lib/flags'
import { CurrencySelector } from './components/CurrencySelector'
import { MetricCard } from './components/MetricCard'
import { ComparisonChart } from './components/ComparisonChart'

const DEFAULT_A = 'AUD'
const DEFAULT_B = 'USD'

export default function App() {
  const [entries, setEntries] = useState<Map<string, BigMacEntry>>(new Map())
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null)
  const [liveRateDate, setLiveRateDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currencyA, setCurrencyA] = useState(DEFAULT_A)
  const [currencyB, setCurrencyB] = useState(DEFAULT_B)

  useEffect(() => {
    Promise.all([fetchBigMacData(), fetchLiveRates()])
      .then(([bigmac, rates]) => {
        setEntries(bigmac)
        setLiveRates(rates.rates)
        setLiveRateDate(rates.date)
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const entryList = Array.from(entries.values())
  const entryA = entries.get(currencyA)
  const entryB = entries.get(currencyB)
  const entryUS = entries.get('USD')

  const liveRateA = liveRates && entryA ? getLiveRate(liveRates, entryA.currency_code) : null
  const liveRateB = liveRates && entryB ? getLiveRate(liveRates, entryB.currency_code) : null

  const valA = entryA && entryUS ? computeValuation(entryA, entryUS, liveRateA) : null
  const valB = entryB && entryUS ? computeValuation(entryB, entryUS, liveRateB) : null
  const cross =
    entryA && entryB ? computeCrossValuation(entryA, entryB, liveRateA, liveRateB) : null

  const useLiveRates = liveRates !== null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍔</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">BigMacExchange</h1>
              <p className="text-xs text-slate-400">Purchasing power parity explorer</p>
            </div>
          </div>
          {liveRateDate && (
            <div className="text-right text-xs text-slate-500">
              <p>Live rates: {liveRateDate}</p>
              <p>Survey data: {entryA?.date ?? '—'}</p>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />
            <p className="text-sm">Fetching Big Mac data…</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-400">
            Failed to load data: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-8">
            {/* Currency selectors */}
            <div className="grid grid-cols-2 gap-4">
              <CurrencySelector
                label="Currency A"
                value={currencyA}
                onChange={setCurrencyA}
                entries={entryList}
                accentColor="#f59e0b"
              />
              <CurrencySelector
                label="Currency B"
                value={currencyB}
                onChange={setCurrencyB}
                entries={entryList}
                accentColor="#818cf8"
              />
            </div>

            {/* Explainer */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-400 leading-relaxed flex flex-col gap-3">
              <p>
                <strong className="text-slate-300">How it works:</strong> The Big Mac Index compares
                each country's Big Mac price (in USD) against the US price. If a Big Mac is cheaper
                than in the US after conversion, the currency is <em>undervalued</em> — and vice versa.
                The implied PPP rate is what the exchange rate <em>should</em> be for prices to equalise.
                {useLiveRates
                  ? ' Live exchange rates are being used for current valuations.'
                  : ' Using survey-date exchange rates only.'}
              </p>
              <p>
                <strong className="text-slate-300">Interpreting results:</strong> If a currency is{' '}
                <span className="text-emerald-400">undervalued</span>, it buys less abroad than its
                domestic purchasing power suggests it should — imports and overseas travel feel
                expensive, and foreign assets cost more in local terms. Governments sometimes
                tolerate this to keep exports competitive.{' '}
                <span className="text-red-400">Overvalued</span> means the opposite: the currency
                punches above its weight, making foreign goods and travel cheaper but potentially
                hurting exporters. For the A/B cross-rate, the same logic applies between the two
                selected currencies — if A is undervalued vs B, goods priced in B cost more than
                the Big Mac benchmark suggests is fair.
              </p>
            </div>

            {/* Chart */}
            {valA && valB && (
              <ComparisonChart
                currencyA={{
                  name: `${entryA!.currency_code}`,
                  valuation: useLiveRates
                    ? (valA.liveValuationVsUsd ?? valA.surveyValuationVsUsd)
                    : valA.surveyValuationVsUsd,
                  flag: getFlag(entryA!.iso_a3),
                }}
                currencyB={{
                  name: `${entryB!.currency_code}`,
                  valuation: useLiveRates
                    ? (valB.liveValuationVsUsd ?? valB.surveyValuationVsUsd)
                    : valB.surveyValuationVsUsd,
                  flag: getFlag(entryB!.iso_a3),
                }}
                crossAB={
                  cross
                    ? useLiveRates
                      ? (cross.liveValuation ?? cross.surveyValuation)
                      : cross.surveyValuation
                    : null
                }
                useLiveRates={useLiveRates}
              />
            )}

            {/* Metric cards */}
            {valA && valB && cross && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard
                  title="Currency A vs USD"
                  valuationPct={
                    useLiveRates
                      ? (valA.liveValuationVsUsd ?? valA.surveyValuationVsUsd)
                      : valA.surveyValuationVsUsd
                  }
                  bigMacUsd={valA.bigMacUsd}
                  localPrice={valA.localPrice}
                  currencyCode={valA.currencyCode}
                  surveyRate={valA.surveyRate}
                  liveRate={valA.liveRate}
                  impliedRate={valA.impliedRateVsUsd}
                  flag={getFlag(entryA!.iso_a3)}
                  countryName={valA.countryName}
                />
                <MetricCard
                  title="Currency B vs USD"
                  valuationPct={
                    useLiveRates
                      ? (valB.liveValuationVsUsd ?? valB.surveyValuationVsUsd)
                      : valB.surveyValuationVsUsd
                  }
                  bigMacUsd={valB.bigMacUsd}
                  localPrice={valB.localPrice}
                  currencyCode={valB.currencyCode}
                  surveyRate={valB.surveyRate}
                  liveRate={valB.liveRate}
                  impliedRate={valB.impliedRateVsUsd}
                  flag={getFlag(entryB!.iso_a3)}
                  countryName={valB.countryName}
                />
                <MetricCard
                  title="A vs B cross-rate"
                  valuationPct={
                    useLiveRates
                      ? (cross.liveValuation ?? cross.surveyValuation)
                      : cross.surveyValuation
                  }
                  bigMacUsd={valA.bigMacUsd}
                  localPrice={entryA!.local_price}
                  currencyCode={`${currencyA}/${currencyB}`}
                  localCurrencyCode={currencyA}
                  surveyRate={cross.surveyRate}
                  liveRate={cross.liveRate}
                  impliedRate={cross.impliedRate}
                  flag={`${getFlag(entryA!.iso_a3)}${getFlag(entryB!.iso_a3)}`}
                  countryName={`${currencyA} per ${currencyB}`}
                  isCross
                />
              </div>
            )}

            {/* Footer */}
            <p className="text-center text-xs text-slate-600">
              Big Mac data ©{' '}
              <a
                href="https://github.com/TheEconomist/big-mac-data"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-400"
              >
                The Economist
              </a>{' '}
              · Exchange rates via{' '}
              <a
                href="https://github.com/fawazahmed0/exchange-api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-400"
              >
                fawazahmed0/exchange-api
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
