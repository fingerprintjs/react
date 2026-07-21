import { useVisitorData, UseVisitorDataReturn } from '../src'
import { act, render, renderHook, screen } from '@testing-library/react'
import { actWait, createWrapper, wait } from './helpers'
import { useEffect, useState } from 'react'
import userEvent from '@testing-library/user-event'
import * as agent from '@fingerprint/agent'
import { GetResult } from '@fingerprint/agent'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetResult = {
  visitor_id: 'kOzFgO0kw2Eivvb14mRL',
  event_id: '1765898371879.Sad9kq',
  sealed_result: null,
  cache_hit: false,
  suspect_score: 0.5,
} satisfies GetResult

const mockGet = vi.fn()
const mockAgent = {
  get: mockGet,
  collect: vi.fn(),
}

vi.mock('@fingerprint/agent', { spy: true })

const mockStart = vi.mocked(agent.start)

describe('useVisitorData', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    mockStart.mockReturnValue(mockAgent)
  })

  it('should provide the Fp context', () => {
    const wrapper = createWrapper()
    const {
      result: { current },
      rerender,
    } = renderHook(() => useVisitorData(), { wrapper })

    rerender()

    expect(current).toBeDefined()
  })

  it('should call getData on mount by default', async () => {
    mockGet.mockImplementation(() => mockGetResult)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData({ immediate: true }), { wrapper })
    expect(result.current).toMatchObject(
      expect.objectContaining({
        isLoading: true,
        data: undefined,
      })
    )

    await actWait(500)

    expect(mockStart).toHaveBeenCalled()
    expect(mockGet).toHaveBeenCalled()
    expect(result.current).toMatchObject(
      expect.objectContaining({
        isLoading: false,
        data: mockGetResult,
      })
    )
  })

  it('should avoid duplicate requests if one is already pending', async () => {
    mockGet.mockImplementation(async () => {
      await wait(250)
      return mockGetResult
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData({ immediate: false }), { wrapper })
    expect(result.current).toMatchObject(
      expect.objectContaining({
        isLoading: false,
        data: undefined,
      })
    )

    await Promise.all([result.current.getData(), result.current.getData()])

    await actWait(500)

    expect(mockStart).toHaveBeenCalled()
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(result.current).toMatchObject(
      expect.objectContaining({
        isLoading: false,
        data: mockGetResult,
      })
    )
  })

  it('should not deduplicate requests with distinct empty tag values', async () => {
    mockGet.mockImplementation(async () => {
      await wait(250)
      return mockGetResult
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData({ immediate: false }), { wrapper })

    await Promise.all([
      result.current.getData({ tag: undefined }),
      result.current.getData({ tag: null }),
      result.current.getData({ tag: '' }),
    ])

    expect(mockGet).toHaveBeenCalledTimes(3)
  })

  it("shouldn't call getData on mount if 'immediate' option is set to false", () => {
    mockGet.mockImplementation(() => mockGetResult)

    const wrapper = createWrapper()
    const { rerender } = renderHook(() => useVisitorData({ immediate: false }), { wrapper })

    expect(mockGet).not.toHaveBeenCalled()

    rerender()

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('should support immediate fetch with cache disabled', async () => {
    const wrapper = createWrapper()
    renderHook(() => useVisitorData({ immediate: true }), { wrapper })

    await actWait(500)

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith({})
  })

  it('should support overwriting default cache option in getData call', async () => {
    const wrapper = createWrapper()
    const hook = renderHook(() => useVisitorData({ immediate: false }), {
      wrapper,
    })

    await act(async () => {
      await hook.result.current.getData()
    })

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith({})
  })

  it('should re-fetch data when options change if "immediate" is set to true', async () => {
    const Component = () => {
      const [tag, setTag] = useState(1)
      const { data } = useVisitorData({ immediate: true, tag })

      return (
        <>
          <button
            onClick={() => {
              setTag((prev) => prev + 1)
            }}
          >
            Change options
          </button>
          <pre>{JSON.stringify(data)}</pre>
        </>
      )
    }

    const Wrapper = createWrapper()
    const user = userEvent.setup()

    render(
      <Wrapper>
        <Component />
      </Wrapper>
    )

    await actWait(1000)

    await user.click(screen.getByRole('button', { name: 'Change options' }))

    await actWait(1000)

    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenNthCalledWith(1, { tag: 1 })
    expect(mockGet).toHaveBeenNthCalledWith(2, { tag: 2 })
  })

  it('should correctly pass errors from agent', async () => {
    const ERROR_CLIENT_TIMEOUT = 'timeout'
    mockGet.mockRejectedValue(new Error(ERROR_CLIENT_TIMEOUT))

    const wrapper = createWrapper()
    const hook = renderHook(() => useVisitorData({ immediate: false }), { wrapper })

    await act(async () => {
      const promise = hook.result.current.getData()

      await expect(promise).rejects.toThrow(ERROR_CLIENT_TIMEOUT)
    })

    expect(hook.result.current.error?.message).toBe(ERROR_CLIENT_TIMEOUT)
  })

  it('`getVisitorData` `getOptions` should be passed from `getVisitorData` `getOptions`', async () => {
    const useVisitorDataId = 'useVisitorDataId'
    const wrapper = createWrapper()
    const hook = renderHook(
      () =>
        useVisitorData({
          linkedId: useVisitorDataId,
          tag: { tagA: useVisitorDataId },
          immediate: false,
        }),
      { wrapper }
    )

    await act(async () => {
      await hook.result.current.getData()
    })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith({ linkedId: useVisitorDataId, tag: { tagA: useVisitorDataId } })
  })

  it('`getData` `getOptions` should be more important than `getVisitorData` `getOptions`', async () => {
    const getDataId = 'getDataId'
    const useVisitorDataId = 'useVisitorDataId'
    const wrapper = createWrapper()
    const hook = renderHook(
      () =>
        useVisitorData({
          linkedId: useVisitorDataId,
          tag: { tagA: useVisitorDataId },
          immediate: false,
        }),
      { wrapper }
    )

    await act(async () => {
      await hook.result.current.getData({
        linkedId: getDataId,
        tag: { tagA: getDataId },
      })
    })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith({ linkedId: getDataId, tag: { tagA: getDataId } })
  })

  it('`getData` `getOptions` should extend `getVisitorData` `getOptions`', async () => {
    const getDataId = 'getDataId'
    const useVisitorDataId = 'useVisitorDataId'
    const wrapper = createWrapper()
    const hook = renderHook(
      () =>
        useVisitorData({
          linkedId: useVisitorDataId,
          tag: { tagA: useVisitorDataId },
          immediate: false,
        }),
      { wrapper }
    )

    await act(async () => {
      await hook.result.current.getData({
        linkedId: getDataId,
      })
    })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith({ linkedId: getDataId, tag: { tagA: useVisitorDataId } })
  })

  it('getData should only change if the getOptions semantically changes', async () => {
    // This test will result in the component rendering four times:
    // 1. The initial render - the getData callback is initially created
    // 2. Count is incremented from 0 to 1 - the getData callback should not change because getOptions did not change
    // 3. Count is incremented from 1 to 2 - getOptions changes but the getData callback does not change this render
    // 4. useVisitorData updated its state during the previous render and the previous render is thrown away and
    //    another render is triggered
    // Notably, the effects for the component are not executed between 3 and 4.
    //
    // More information about this pattern can be found at:
    // https://react.dev/reference/react/useState#storing-information-from-previous-renders

    const getDataValues: UseVisitorDataReturn['getData'][] = []
    let effectCount = 0
    const Component = () => {
      const [count, setCount] = useState(0)
      const { data, getData } = useVisitorData(
        count <= 1 ? { timeout: 1000, immediate: false } : { timeout: 2000, immediate: false }
      )

      useEffect(() => {
        effectCount++
      })

      getDataValues.push(getData)
      return (
        <>
          <button
            onClick={() => {
              setCount((count) => count + 1)
            }}
          >
            Increment count
          </button>
          <pre>{JSON.stringify(data)}</pre>
        </>
      )
    }

    const Wrapper = createWrapper()
    const user = userEvent.setup()

    render(
      <Wrapper>
        <Component />
      </Wrapper>
    )

    const incrementButton = screen.getByRole('button', { name: 'Increment count' })
    await user.click(incrementButton)

    // This second click needs to be a separate awaited interaction otherwise
    // React will coalesce the state updates to the count into a
    // a single update. Meaning that count will jump from 0 to 2
    // in between renders if this click were in the previous act block.
    // This ensures that the case is covered where the options
    // object does not semantically change.
    await user.click(incrementButton)

    expect(getDataValues).toHaveLength(4)
    expect(getDataValues[0]).toBe(getDataValues[1])
    expect(getDataValues[1]).toBe(getDataValues[2])
    expect(getDataValues[2]).not.toBe(getDataValues[3])
    expect(effectCount).toEqual(3)
  })

  it('should treat tags with differently ordered object keys as equal', async () => {
    const getDataValues: UseVisitorDataReturn['getData'][] = []
    const Component = () => {
      const [reverseKeys, setReverseKeys] = useState(false)
      const { getData } = useVisitorData({
        immediate: false,
        tag: reverseKeys ? { second: 2, first: 1 } : { first: 1, second: 2 },
      })

      getDataValues.push(getData)

      return (
        <button
          onClick={() => {
            setReverseKeys(true)
          }}
        >
          Reverse keys
        </button>
      )
    }
    const Wrapper = createWrapper()
    const user = userEvent.setup()

    render(
      <Wrapper>
        <Component />
      </Wrapper>
    )
    await user.click(screen.getByRole('button', { name: 'Reverse keys' }))

    expect(getDataValues).toHaveLength(2)
    expect(getDataValues[1]).toBe(getDataValues[0])
  })
})
