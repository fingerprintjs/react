import { PropsWithChildren } from 'react'
import { FingerprintProvider, FingerprintProviderOptions } from '../src'
import { act } from '@testing-library/react'

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

export const actWait = async (ms: number) => {
  await act(async () => {
    await wait(ms)
  })
}
