import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react'
import { FingerprintContext } from '../fingerprint-context'
import { Agent, GetOptions, start, StartOptions, default as Loader } from '@fingerprint/agent'
import * as packageInfo from '../../package.json'
import { isSSR } from '../ssr'
import { WithEnvironment } from './with-environment'
import type { EnvDetails } from '../env.types'
import { usePromiseStore } from '../utils/use-promise-store'

export interface FingerprintProviderOptions extends StartOptions {
  /**
   * If set to `true`, will force the agent to be rebuilt with the new options. Should be used with caution
   * since it can be triggered too often (e.g. on every render) and negatively affect performance of the JS agent.
   */
  forceRebuild?: boolean
}

/**
 * @example
 * ```jsx
 * <FingerprintProvider
 *   apiKey="<your-fpjs-public-api-key>"
 * >
 *   <MyApp />
 * </FingerprintProvider>
 * ```
 *
 * Provides the FpContext to its child components.
 *
 * @privateRemarks
 * This is just a wrapper around the actual provider.
 * For the implementation, see `ProviderWithEnv` component.
 */
export function FingerprintProvider(props: PropsWithChildren<FingerprintProviderOptions>) {
  return <WithEnvironment>{(env) => <ProviderWithEnv {...props} env={env} />}</WithEnvironment>
}

interface ProviderWithEnvProps extends FingerprintProviderOptions {
  /**
   * Contains details about the env we're currently running in (e.g. framework, version)
   */
  env: EnvDetails
  getOptions?: GetOptions
}

function isLoader(value: unknown): value is Pick<typeof Loader, 'start'> {
  return typeof value === 'object' && value !== null && 'start' in value && typeof value.start === 'function'
}

function getCustomLoader(props: Record<string, unknown>) {
  if ('customAgent' in props && isLoader(props.customAgent)) {
    return props.customAgent
  }

  return undefined
}

function ProviderWithEnv({
  children,
  forceRebuild,
  env,
  getOptions,
  ...agentOptions
}: PropsWithChildren<ProviderWithEnvProps>) {
  const createClient = useCallback(() => {
    const customLoader = getCustomLoader(agentOptions)

    const envInfo = env.version !== undefined && env.version !== '' ? `${env.name}/${env.version}` : env.name
    const integrationInfo = `react-sdk/${packageInfo.version}/${envInfo}`

    const mergedIntegrationInfo = [...(agentOptions.integrationInfo ?? []), integrationInfo]

    const startParams = {
      ...agentOptions,
      integrationInfo: mergedIntegrationInfo,
    }

    return customLoader ? customLoader.start(startParams) : start(startParams)
  }, [agentOptions, env])

  const clientRef = useRef<Agent | undefined>(undefined)

  const getClient = useCallback(() => {
    if (isSSR()) {
      throw new Error('FingerprintProvider client cannot be used in SSR')
    }

    clientRef.current ??= createClient()

    return clientRef.current
  }, [createClient])

  const { doRequest } = usePromiseStore()

  const getVisitorData = useCallback(
    (options?: GetOptions) => {
      const client = getClient()

      const mergedOptions = {
        ...getOptions,
        ...options,
      }

      return doRequest(async () => client.get(mergedOptions), mergedOptions)
    },
    [doRequest, getClient, getOptions]
  )

  const contextValue = useMemo(() => {
    return {
      getVisitorData,
    }
  }, [getVisitorData])

  useEffect(() => {
    // By default, the client is always initialized once during the first render and won't be updated
    // if the configuration changes. Use `forceRebuild` flag to disable this behaviour.
    if (!clientRef.current || forceRebuild === true) {
      clientRef.current = createClient()
    }
  }, [forceRebuild, agentOptions, getOptions, createClient])

  return <FingerprintContext.Provider value={contextValue}>{children}</FingerprintContext.Provider>
}
