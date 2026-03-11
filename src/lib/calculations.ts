import type { BigMacEntry } from './bigmac'

export interface ValuationResult {
  // Big Mac price in USD
  bigMacUsd: number
  // Local price in native currency
  localPrice: number
  // Currency code
  currencyCode: string
  // Country name
  countryName: string
  // Exchange rate at time of survey (local units per 1 USD)
  surveyRate: number
  // Live exchange rate (local units per 1 USD), null if unavailable
  liveRate: number | null
  // Implied PPP rate vs USD (what the rate "should" be based on Big Mac prices)
  impliedRateVsUsd: number
  // % over/undervaluation vs USD using survey rate
  surveyValuationVsUsd: number
  // % over/undervaluation vs USD using live rate, null if no live rate
  liveValuationVsUsd: number | null
  // Data date from Big Mac survey
  dataDate: string
}

export interface CrossValuationResult {
  // A vs B using survey rates
  surveyValuation: number
  // A vs B using live rates, null if unavailable
  liveValuation: number | null
  // Actual A/B rate at survey time (units of B per 1 unit of A)
  surveyRate: number
  // Actual A/B rate using live data
  liveRate: number | null
  // Implied PPP cross-rate (units of B per 1 unit of A)
  impliedRate: number
  // What a Big Mac costs in A, expressed in B's currency (= bigMacUsd_A / bigMacUsd_B * dollar_ex_B)
  bigMacPriceAinB: number
}

const US_CURRENCY = 'USD'

export function computeValuation(
  entry: BigMacEntry,
  usEntry: BigMacEntry,
  liveRate: number | null
): ValuationResult {
  // Implied PPP rate: local_price / us_local_price
  const impliedRateVsUsd = entry.local_price / usEntry.local_price

  const surveyValuationVsUsd = (impliedRateVsUsd - entry.dollar_ex) / entry.dollar_ex * 100

  let liveValuationVsUsd: number | null = null
  if (liveRate !== null) {
    liveValuationVsUsd = (impliedRateVsUsd - liveRate) / liveRate * 100
  }

  return {
    bigMacUsd: entry.dollar_price,
    localPrice: entry.local_price,
    currencyCode: entry.currency_code,
    countryName: entry.name,
    surveyRate: entry.dollar_ex,
    liveRate,
    impliedRateVsUsd,
    surveyValuationVsUsd,
    liveValuationVsUsd,
    dataDate: entry.date,
  }
}

export function computeCrossValuation(
  entryA: BigMacEntry,
  entryB: BigMacEntry,
  liveRateA: number | null,
  liveRateB: number | null
): CrossValuationResult {
  // Units of B per 1 unit of A
  const surveyRate = entryA.dollar_ex / entryB.dollar_ex

  // Implied PPP cross-rate: local_price_A / local_price_B
  const impliedRate = entryA.local_price / entryB.local_price

  const surveyValuation = (impliedRate - surveyRate) / surveyRate * 100

  let liveRate: number | null = null
  let liveValuation: number | null = null
  if (liveRateA !== null && liveRateB !== null) {
    liveRate = liveRateA / liveRateB
    liveValuation = (impliedRate - liveRate) / liveRate * 100
  }

  // Big Mac price in A's currency expressed in B's currency
  const bigMacPriceAinB = entryA.local_price / (entryA.dollar_ex / entryB.dollar_ex)

  return {
    surveyValuation,
    liveValuation,
    surveyRate,
    liveRate,
    impliedRate,
    bigMacPriceAinB,
  }
}

export { US_CURRENCY }
