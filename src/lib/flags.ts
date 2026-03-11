// Map ISO 3166-1 alpha-3 country codes to flag emojis
// Flag emoji = regional indicator letters from ISO 3166-1 alpha-2 code
const ISO3_TO_ISO2: Record<string, string> = {
  ARG: 'AR', AUS: 'AU', AUT: 'AT', AZE: 'AZ', BHR: 'BH', BLR: 'BY',
  BRA: 'BR', CAN: 'CA', CHE: 'CH', CHL: 'CL', CHN: 'CN', COL: 'CO',
  CRI: 'CR', CZE: 'CZ', DNK: 'DK', EGY: 'EG', EUZ: 'EU', GBR: 'GB',
  GTM: 'GT', HKG: 'HK', HND: 'HN', HRV: 'HR', HUN: 'HU', IDN: 'ID',
  IND: 'IN', ISR: 'IL', JOR: 'JO', JPN: 'JP', KAZ: 'KZ', KOR: 'KR',
  KWT: 'KW', LKA: 'LK', MEX: 'MX', MYS: 'MY', NIC: 'NI', NLD: 'NL',
  NOR: 'NO', NZL: 'NZ', OMN: 'OM', PAK: 'PK', PER: 'PE', PHL: 'PH',
  POL: 'PL', QAT: 'QA', ROM: 'RO', RUS: 'RU', SAU: 'SA', SGP: 'SG',
  SLV: 'SV', SRB: 'RS', SWE: 'SE', THA: 'TH', TUR: 'TR', TWN: 'TW',
  UKR: 'UA', URY: 'UY', USA: 'US', VEN: 'VE', VNM: 'VN', ZAF: 'ZA',
  MDA: 'MD', MKD: 'MK', GEO: 'GE', ARM: 'AM', ARE: 'AE', KHM: 'KH',
  MMR: 'MM', BGD: 'BD', LBN: 'LB', MOZ: 'MZ', RWA: 'RW', TZA: 'TZ',
  UGA: 'UG', ZMB: 'ZM', GHA: 'GH', KEN: 'KE', NGA: 'NG', ETH: 'ET',
  MAR: 'MA', DZA: 'DZ', TUN: 'TN',
}

function iso2ToFlag(iso2: string): string {
  if (iso2 === 'EU') return '🇪🇺'
  return [...iso2.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

export function getFlag(iso_a3: string): string {
  const iso2 = ISO3_TO_ISO2[iso_a3]
  if (!iso2) return '🌐'
  return iso2ToFlag(iso2)
}
