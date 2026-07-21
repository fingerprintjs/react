import { assertIsDefined } from '../src/utils/assert-is-defined'
import { getOptionsCacheKey, areGetOptionsEqual } from '../src/utils/get-options-cache-key'
import { toError } from '../src/utils/to-error'
import { describe, expect, it } from 'vitest'

describe('assertIsDefined', () => {
  it('allows defined values', () => {
    expect(() => {
      assertIsDefined('ok', 'value')
    }).not.toThrow()
    expect(() => {
      assertIsDefined(0, 'value')
    }).not.toThrow()
  })

  it('throws for null or undefined', () => {
    expect(() => {
      assertIsDefined(null, 'value')
    }).toThrow('value must not be null or undefined')
    expect(() => {
      assertIsDefined(undefined, 'value')
    }).toThrow('value must not be null or undefined')
  })
})

describe('toError', () => {
  it('returns Error instances as-is', () => {
    const error = new Error('boom')
    expect(toError(error)).toBe(error)
  })

  it('wraps non-Error values', () => {
    expect(toError('raw')).toEqual(new Error('raw'))
    expect(toError(42)).toEqual(new Error('42'))
  })
})

describe('getOptionsCacheKey', () => {
  it('returns an empty key for missing options', () => {
    expect(getOptionsCacheKey()).toBe('')
    expect(getOptionsCacheKey(undefined)).toBe('')
  })

  it('distinguishes empty-ish tag values', () => {
    expect(getOptionsCacheKey({ tag: undefined })).not.toBe(getOptionsCacheKey({ tag: null }))
    expect(getOptionsCacheKey({ tag: null })).not.toBe(getOptionsCacheKey({ tag: '' }))
  })

  it('treats object tags with differently ordered keys as equal', () => {
    expect(areGetOptionsEqual({ tag: { a: 1, b: 2 } }, { tag: { b: 2, a: 1 } })).toBe(true)
  })

  it('serializes array tags', () => {
    expect(getOptionsCacheKey({ tag: [{ b: 2, a: 1 }, 'x'] })).toBe(getOptionsCacheKey({ tag: [{ a: 1, b: 2 }, 'x'] }))
  })

  it('falls back for circular values', () => {
    const circular: { self?: unknown } = {}
    circular.self = circular

    expect(getOptionsCacheKey({ tag: circular })).toContain('unserializable:object')
  })
})
