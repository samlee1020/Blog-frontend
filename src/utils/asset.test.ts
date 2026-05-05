import { describe, expect, it } from 'vitest'
import { toAssetUrl } from './asset'

describe('toAssetUrl', () => {
  it('keeps absolute URLs', () => {
    expect(toAssetUrl('https://example.com/a.png')).toBe('https://example.com/a.png')
  })

  it('joins upload paths with API origin', () => {
    expect(toAssetUrl('/uploads/a.png')).toBe('/uploads/a.png')
  })
})
