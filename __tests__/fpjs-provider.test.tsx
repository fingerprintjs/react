import { PropsWithChildren, useContext } from 'react'
import { act, render, renderHook } from '@testing-library/react'
import { FingerprintContext, FingerprintProvider, FingerprintProviderOptions, useVisitorData } from '../src'
import { createWrapper, getDefaultStartOptions } from './helpers'
import { version } from '../package.json'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as agent from '@fingerprint/agent'
import type { GetOptions } from '@fingerprint/agent'
import * as ssr from '../src/ssr'

vi.mock('@fingerprint/agent', { spy: true })

const mockGet = vi.fn()
const mockAgent = {
  get: mockGet,
  collect: vi.fn(),
}

const mockStart = vi.mocked(agent.start)

type InternalFingerprintProviderOptions = FingerprintProviderOptions & {
  customAgent?: Pick<typeof agent, 'start'>
  getOptions?: GetOptions
}

const InternalFingerprintProvider = (props: PropsWithChildren<InternalFingerprintProviderOptions>) => (
  <FingerprintProvider {...props} />
)

const renderProvider = (props: Partial<FingerprintProviderOptions> = {}) =>
  render(
    <FingerprintProvider {...getDefaultStartOptions()} {...props}>
      <div />
    </FingerprintProvider>
  )

describe('FingerprintProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockStart.mockReturnValue(mockAgent)
    mockGet.mockResolvedValue({
      visitor_id: 'visitor',
      event_id: 'event',
      sealed_result: null,
      cache_hit: false,
      suspect_score: 0,
    })
  })

  afterEach(() => {
    document.getElementById('__NEXT_DATA__')?.remove()
    Reflect.deleteProperty(window, 'next')
    vi.restoreAllMocks()
  })

  it('should configure an instance of the Fp Agent', () => {
    const loadOptions = getDefaultStartOptions()
    const wrapper = createWrapper({
      cache: {
        cachePrefix: 'cache',
        storage: 'sessionStorage',
        duration: 100,
      },
    })
    renderHook(() => useContext(FingerprintContext), {
      wrapper,
    })
    expect(mockStart).toHaveBeenCalledWith({
      ...loadOptions,
      integrationInfo: [`react-sdk/${version}/react`],
      cache: {
        cachePrefix: 'cache',
        storage: 'sessionStorage',
        duration: 100,
      },
    })
  })

  it('should include next version in integrationInfo when Next.js is detected', () => {
    Object.assign(window, { next: { version: '14.2.0' } })

    renderProvider()

    expect(mockStart).toHaveBeenCalledWith(
      expect.objectContaining({
        integrationInfo: [`react-sdk/${version}/next/14.2.0`],
      })
    )
  })

  it('should rebuild the agent when forceRebuild is enabled and options change', () => {
    const { rerender } = renderProvider({ apiKey: 'key-a', forceRebuild: true })

    expect(mockStart).toHaveBeenCalledTimes(1)

    rerender(
      <FingerprintProvider apiKey='key-b' forceRebuild>
        <div />
      </FingerprintProvider>
    )

    expect(mockStart).toHaveBeenCalledTimes(2)
    expect(mockStart).toHaveBeenLastCalledWith(
      expect.objectContaining({
        apiKey: 'key-b',
      })
    )
  })

  it('should not rebuild the agent when options change without forceRebuild', () => {
    const { rerender } = renderProvider({ apiKey: 'key-a' })

    expect(mockStart).toHaveBeenCalledTimes(1)

    rerender(
      <FingerprintProvider apiKey='key-b'>
        <div />
      </FingerprintProvider>
    )

    expect(mockStart).toHaveBeenCalledTimes(1)
  })

  it('should use customAgent.start when a valid custom agent loader is provided', async () => {
    const customStart = vi.fn().mockReturnValue(mockAgent)
    const wrapper = ({ children }: PropsWithChildren) => (
      <InternalFingerprintProvider {...getDefaultStartOptions()} customAgent={{ start: customStart }}>
        {children}
      </InternalFingerprintProvider>
    )

    const { result } = renderHook(() => useVisitorData({ immediate: false }), { wrapper })

    await act(async () => {
      await result.current.getData()
    })

    expect(customStart).toHaveBeenCalled()
    expect(mockStart).not.toHaveBeenCalled()
  })

  it('should fall back to the default agent when customAgent is invalid', async () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <InternalFingerprintProvider
        {...getDefaultStartOptions()}
        // @ts-expect-error intentionally invalid runtime shape
        customAgent={{ start: 'not-a-function' }}
      >
        {children}
      </InternalFingerprintProvider>
    )

    const { result } = renderHook(() => useVisitorData({ immediate: false }), { wrapper })

    await act(async () => {
      await result.current.getData()
    })

    expect(mockStart).toHaveBeenCalled()
  })

  it('should merge provider getOptions into visitor data requests', async () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <InternalFingerprintProvider
        {...getDefaultStartOptions()}
        getOptions={{ linkedId: 'from-provider', tag: { source: 'provider' } }}
      >
        {children}
      </InternalFingerprintProvider>
    )

    const { result } = renderHook(() => useVisitorData({ immediate: false }), { wrapper })

    await act(async () => {
      await result.current.getData({ tag: { source: 'getData' } })
    })

    expect(mockGet).toHaveBeenCalledWith({
      linkedId: 'from-provider',
      tag: { source: 'getData' },
    })
  })

  it('should throw when the client is used during SSR', async () => {
    vi.spyOn(ssr, 'isSSR').mockReturnValue(true)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData({ immediate: false }), { wrapper })

    await expect(result.current.getData()).rejects.toThrow('FingerprintProvider client cannot be used in SSR')
  })
})
