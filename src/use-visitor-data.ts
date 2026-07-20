import { FingerprintContext, FingerprintContextInterface, VisitorQueryResult } from './fingerprint-context'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import deepEquals from 'fast-deep-equal'
import { toError } from './utils/to-error'
import { assertIsDefined } from './utils/assert-is-defined'
import { GetOptions, GetResult } from '@fingerprint/agent'

export interface UseVisitorDataConfig {
  /**
   * Determines whether the `getData()` method will be called immediately after the hook mounts or not
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
  const [queryState, setQueryState] = useState<VisitorQueryResult>({
    isLoading: immediate,
    data: undefined,
    isFetched: false,
    error: undefined,
  })

  const getData = useCallback<UseVisitorDataReturn['getData']>(
    async (params = {}) => {
      assertIsDefined(params, 'getDataParams')

      try {
        setQueryState({
          isLoading: true,
          isFetched: false,
          data: undefined,
          error: undefined,
        })

        const getDataOptions: GetOptions = {
          ...currentGetOptions,
          ...params,
        }

        const result = await getVisitorData(getDataOptions)
        setQueryState({
          isLoading: false,
          isFetched: true,
          data: result,
          error: undefined,
        })

        return result
      } catch (unknownError) {
        const error = toError(unknownError)

        setQueryState({
          isLoading: false,
          isFetched: false,
          data: undefined,
          error,
        })

        throw error
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
    if (!immediate) {
      return
    }

    let ignore = false

    getVisitorData(currentGetOptions)
      .then((result) => {
        if (ignore) {
          return
        }

        setQueryState({
          isLoading: false,
          isFetched: true,
          data: result,
          error: undefined,
        })
      })
      .catch((unknownError: unknown) => {
        if (ignore) {
          return
        }

        setQueryState({
          isLoading: false,
          isFetched: false,
          data: undefined,
          error: toError(unknownError),
        })
        console.error(`Failed to fetch visitor data on mount: ${String(unknownError)}`)
      })

    return () => {
      ignore = true
    }
  }, [immediate, getVisitorData, currentGetOptions])

  // When `getOptions` change, store them (triggering a refetch via the effect above) and reset to loading
  // state right away: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (!Object.is(currentGetOptions, getOptions) && !deepEquals(currentGetOptions, getOptions)) {
    setCurrentGetOptions(getOptions)

    if (immediate) {
      setQueryState({
        isLoading: true,
        isFetched: false,
        data: undefined,
        error: undefined,
      })
    }
  }

  return useMemo(
    () => ({
      ...queryState,
      getData,
    }),
    [queryState, getData]
  )
}
