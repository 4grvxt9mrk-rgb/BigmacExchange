const PRIMARY_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
const FALLBACK_URL = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json'

interface RateResponse {
  date: string
  usd: Record<string, number>
}

// Returns a map of currency code (lowercase) -> units per 1 USD
export async function fetchLiveRates(): Promise<{ date: string; rates: Record<string, number> }> {
  let data: RateResponse

  try {
    const res = await fetch(PRIMARY_URL)
    data = await res.json()
  } catch {
    const res = await fetch(FALLBACK_URL)
    data = await res.json()
  }

  return { date: data.date, rates: data.usd }
}

// Returns units of currency per 1 USD (live rate), or null if not available
export function getLiveRate(rates: Record<string, number>, currencyCode: string): number | null {
  const rate = rates[currencyCode.toLowerCase()]
  return rate ?? null
}
