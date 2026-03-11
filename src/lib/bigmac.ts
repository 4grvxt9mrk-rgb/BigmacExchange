import Papa from 'papaparse'

export interface BigMacEntry {
  date: string
  iso_a3: string
  currency_code: string
  name: string
  local_price: number
  dollar_ex: number
  dollar_price: number // Big Mac price in USD
  USD_raw: number // % over/undervaluation vs USD
}

const CSV_URL =
  'https://raw.githubusercontent.com/TheEconomist/big-mac-data/master/output-data/big-mac-full-index.csv'

export async function fetchBigMacData(): Promise<Map<string, BigMacEntry>> {
  const response = await fetch(CSV_URL)
  const text = await response.text()

  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  })

  // Keep only the latest entry per currency
  const latest = new Map<string, BigMacEntry>()

  for (const row of result.data) {
    const entry: BigMacEntry = {
      date: row.date,
      iso_a3: row.iso_a3,
      currency_code: row.currency_code,
      name: row.name,
      local_price: parseFloat(row.local_price),
      dollar_ex: parseFloat(row.dollar_ex),
      dollar_price: parseFloat(row.dollar_price),
      USD_raw: parseFloat(row.USD_raw),
    }

    if (
      isNaN(entry.local_price) ||
      isNaN(entry.dollar_ex) ||
      isNaN(entry.dollar_price)
    ) {
      continue
    }

    const existing = latest.get(entry.currency_code)
    if (!existing || entry.date > existing.date) {
      latest.set(entry.currency_code, entry)
    }
  }

  return latest
}
