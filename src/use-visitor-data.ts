import { FingerprintContext, FingerprintContextInterface, VisitorQueryResult } from './fingerprint-context'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import deepEquals from 'fast-deep-equal'
import { toError } from './utils/to-error'
import { assertIsTruthy } from './utils/assert-is-truthy'
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
  assertIsTruthy(getOptions, 'getOptions')

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
      assertIsTruthy(params, 'getDataParams')

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

  useEffect(() => {
    if (immediate) {
      getData().catch((error) => {
        console.error(`Failed to fetch visitor data on mount: ${error}`)
      })
    }
  }, [immediate, getData])

  if (!Object.is(currentGetOptions, getOptions) && !deepEquals(currentGetOptions, getOptions)) {
    setCurrentGetOptions(getOptions)
  }

  return useMemo(
    () => ({
      ...queryState,
      getData,
    }),
    [queryState, getData]
  )
}
