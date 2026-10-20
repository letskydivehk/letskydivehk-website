import { describe, it, expect } from 'vitest'
import { markupOriginal, originalPriceDisplay } from './pricing'
describe('markup original price', () => {
  it('adds 20% and rounds up to next 99', () => {
    expect(markupOriginal(3399)).toBe(4099)
    expect(markupOriginal(2500)).toBe(2999)
    expect(markupOriginal(4999)).toBe(5999)
  })
  it('keeps prefix/suffix', () => {
    expect(originalPriceDisplay('$3,399起')).toBe('$4,099起')
  })
})
