# BigMacExchange

A purchasing power parity (PPP) explorer built around [The Economist's Big Mac Index](https://github.com/TheEconomist/big-mac-data).

Compare any two currencies to see how fairly valued they are relative to each other and to the US dollar, using Big Mac prices as the PPP benchmark.

---

## Features (v1.0)

- **A/B currency comparison** — select any two currencies from ~55 countries tracked by the Big Mac Index
- **Three valuation views per comparison:**
  - Currency A vs USD
  - Currency B vs USD
  - A vs B cross-rate
- **Live exchange rates** — fetched from [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) (no API key required, 200+ currencies via jsDelivr CDN)
- **Survey snapshot** — Big Mac price data from The Economist's GitHub repo (updated January & July each year)
- **Dual rate display** — live rates shown in amber alongside the historical survey-date rate for context
- **Bar chart** — visual over/undervaluation comparison with green (undervalued) / red (overvalued) bars
- **Country flags** — flag emojis in all dropdowns for quick country recognition
- **Defaults to AUD vs USD** — sensible default for an Australian user

---

## How it works

The Big Mac Index is a measure of purchasing power parity (PPP). The idea:

1. A Big Mac costs **$X** in the US
2. A Big Mac costs **Y** local currency units in another country
3. The **implied PPP rate** = `Y / X` — what the exchange rate *should* be if prices were equal
4. The **actual exchange rate** = what the market says
5. If actual > implied: the local currency is **undervalued** (too cheap)
6. If actual < implied: the local currency is **overvalued** (too expensive)

For the A vs B **cross-rate**, the same logic applies but comparing the two countries directly rather than vs USD.

---

## Data sources

| Source | URL | Notes |
|---|---|---|
| Big Mac Index | `github.com/TheEconomist/big-mac-data` | CC BY 4.0, updated Jan & July |
| Exchange rates | `cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/...` | No key, 200+ currencies, daily updates |

---

## Stack

- **Vite + React + TypeScript** — client-side SPA, no backend
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin
- **Recharts** — bar chart
- **PapaParse** — CSV parsing for Big Mac data

---

## Dev

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
```

---

## Potential future features

- Location-aware default currency (browser geolocation API)
- Historical chart — show valuation trend over time (data goes back to 2000)
- All-countries view — rank all currencies by over/undervaluation
- Deployment (Vercel / Netlify — static export, no server needed)
