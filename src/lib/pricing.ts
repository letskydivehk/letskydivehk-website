// Display-only "original" price: current price +20%, rounded UP to the next amount ending in 99.
// The actual selling price is never changed.
export function parsePriceNumber(display?: string | null): number | null {
  if (!display) return null
  const n = parseFloat(String(display).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

export function markupOriginal(price: number): number {
  return Math.ceil((price * 1.2 + 1) / 100) * 100 - 1
}

export function originalPriceDisplay(priceDisplay?: string | null): string | null {
  const n = parsePriceNumber(priceDisplay)
  if (n === null || !/\d/.test(priceDisplay || '')) return null
  const prefix = priceDisplay!.match(/^[^\d]*/)?.[0] || '$'
  const suffix = priceDisplay!.match(/[^\d,.]*$/)?.[0] || ''
  return `${prefix}${markupOriginal(n).toLocaleString('en-US')}${suffix}`
}

export function withMarkupOriginal<T extends { price_display: string; original_price_display?: string | null }>(s: T): T {
  return { ...s, original_price_display: originalPriceDisplay(s.price_display) }
}
