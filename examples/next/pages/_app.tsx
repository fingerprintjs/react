import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { FingerprintProvider } from '@fingerprint/react'

function getPublicApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_FPJS_PUBLIC_API_KEY
  if (apiKey === undefined || apiKey === '') {
    throw new Error('NEXT_PUBLIC_FPJS_PUBLIC_API_KEY is not set')
  }

  return apiKey
}

const fpjsPublicApiKey = getPublicApiKey()

// Optional. Defaults to the SDK's default region (us) when unset or invalid.
const rawRegion = process.env.NEXT_PUBLIC_FPJS_REGION
const fpjsRegion = rawRegion === 'us' || rawRegion === 'eu' || rawRegion === 'ap' ? rawRegion : undefined

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FingerprintProvider apiKey={fpjsPublicApiKey} region={fpjsRegion}>
      <Component {...pageProps} />
    </FingerprintProvider>
  )
}

export default MyApp
