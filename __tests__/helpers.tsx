import { PropsWithChildren } from 'react'
import { FingerprintProvider, FingerprintProviderOptions } from '../src'

export const getDefaultStartOptions = () => ({
  apiKey: 'test_api_key',
})

export const createWrapper =
  (providerProps: Partial<FingerprintProviderOptions> = {}) =>
  ({ children }: PropsWithChildren<object>) => (
    <FingerprintProvider {...getDefaultStartOptions()} {...providerProps}>
      {children}
    </FingerprintProvider>
  )

export const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
