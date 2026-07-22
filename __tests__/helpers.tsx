import { PropsWithChildren } from 'react'
import { FingerprintProvider, FingerprintProviderOptions } from '../src'

export const getDefaultLoadOptions = () => ({
  apiKey: 'test_api_key',
})

export const createWrapper =
  (providerProps: Partial<FingerprintProviderOptions> = {}) =>
  ({ children }: PropsWithChildren<object>) => (
    <FingerprintProvider {...getDefaultLoadOptions()} {...providerProps}>
      {children}
    </FingerprintProvider>
  )

export const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
