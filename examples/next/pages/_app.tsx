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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FingerprintProvider apiKey={fpjsPublicApiKey}>
      <Component {...pageProps} />
    </FingerprintProvider>
  )
}

export default MyApp
