import { FingerprintContext, FingerprintContextInterface, VisitorQueryResult } from './fingerprint-context'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toError } from './utils/to-error'
import { assertIsDefined } from './utils/assert-is-defined'
import { areGetOptionsEqual } from './utils/get-options-cache-key'
import { GetOptions, GetResult } from '@fingerprint/agent'

export interface UseVisitorDataConfig {
  /**
   * Controls automatic visitor data fetching. When `true`, the hook fetches after mounting, and whenever the
   * request options change. When changed from `false` to `true`, visitor data is initiated after the current render.
   */
  immediate: boolean
}

export type UseVisitorDataOptions = GetOptions & UseVisitorDataConfig

export type UseVisitorDataReturn = VisitorQueryResult & {
  /**
   * Performs identification request to server and returns visitors data.
   * */
  getData: (getDataOptions?: GetOptions) => Promise<GetResult>
}

/**
 *  @example
 * ```js
 *  const {
 *    // Request state
 *    data,
 *    isLoading,
 *    error,
 *    // A method to be called manually when the `immediate` field in the config is set to `false`:
 *    getData,
 *  } = useVisitorData({ immediate: false });
 * ```
 * Use the `useVisitorData` hook in your components to perform identification requests with the Fingerprint API. The returned object contains information about loading status, errors, and visitor.
 *
 * @param {UseVisitorDataOptions} options for the `agent.get()` request and for hook
 */
export function useVisitorData(
  { immediate, ...getOptions }: UseVisitorDataOptions = { immediate: true }
): UseVisitorDataReturn {
  assertIsDefined(getOptions, 'getOptions')

  const { getVisitorData } = useContext<FingerprintContextInterface>(FingerprintContext)

  const [currentGetOptions, setCurrentGetOptions] = useState(getOptions)
  const [currentImmediate, setCurrentImmediate] = useState(immediate)
  const [queryState, setQueryState] = useState<VisitorQueryResult>({
    isLoading: immediate,
    data: undefined,
    isFetched: false,
    error: undefined,
  })

  const setLoading = () => {
    setQueryState({
      isLoading: true,
      isFetched: false,
      data: undefined,
      error: undefined,
    })
  }

  const setSuccess = (data: GetResult) => {
    setQueryState({
      isLoading: false,
      isFetched: true,
      data,
      error: undefined,
    })
  }

  const setFailure = (unknownError: unknown) => {
    const error = toError(unknownError)
    setQueryState({
      isLoading: false,
      isFetched: false,
      data: undefined,
      error,
    })
    return error
  }

  const getData = useCallback<UseVisitorDataReturn['getData']>(
    async (params = {}) => {
      assertIsDefined(params, 'getDataParams')

      try {
        setLoading()

        const getDataOptions: GetOptions = {
          ...currentGetOptions,
          ...params,
        }

        const result = await getVisitorData(getDataOptions)
        setSuccess(result)

        return result
      } catch (unknownError) {
        throw setFailure(unknownError)
      }
    },
    [currentGetOptions, getVisitorData]
  )

  /**
   * When `immediate` is enabled, fetches visitor data on mount and whenever `getOptions` change.
   * We don't reuse `getData` here because it sets loading state synchronously, which is not allowed
   * inside an effect — `isLoading: true` is covered by the initial state and the render-phase reset below.
   * The `ignore` flag prevents an outdated in-flight response from overwriting a newer request's state:
   * https://react.dev/reference/react/useEffect#fetching-data-with-effects
   */
  useEffect(() => {
    if (!currentImmediate) {
      return
    }

    let ignore = false

    const fetchVisitorData = async () => {
      try {
        const result = await getVisitorData(currentGetOptions)
        if (!ignore) {
          setSuccess(result)
        }
      } catch (unknownError: unknown) {
        if (ignore) {
          return
        }

        const error = setFailure(unknownError)
        console.error(`Failed to fetch visitor data automatically: ${error}`)
      }
    }

    void fetchVisitorData()

    return () => {
      ignore = true
    }
  }, [currentImmediate, getVisitorData, currentGetOptions])

  // When automatic-fetch inputs change, store them and reset to loading during render so the effect can start
  // the request without synchronously setting state: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const didImmediateChange = currentImmediate !== immediate
  const didGetOptionsChange =
    !Object.is(currentGetOptions, getOptions) && !areGetOptionsEqual(currentGetOptions, getOptions)

  if (didImmediateChange) {
    setCurrentImmediate(immediate)
  }

  if (didGetOptionsChange) {
    setCurrentGetOptions(getOptions)
  }

  if (immediate && (didImmediateChange || didGetOptionsChange)) {
    setLoading()
  } else if (didImmediateChange) {
    // Disabling automatic fetching clears loading while the pending response is ignored.
    setQueryState((state) => ({ ...state, isLoading: false }))
  }

  return useMemo(
    () => ({
      ...queryState,
      getData,
    }),
    [queryState, getData]
  )
}
