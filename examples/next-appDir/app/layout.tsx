import '../styles/globals.css'
import { FingerprintProvider } from '@fingerprint/react'
import { PropsWithChildren } from 'react'

function getPublicApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_FPJS_PUBLIC_API_KEY
  if (apiKey === undefined || apiKey === '') {
    throw new Error('NEXT_PUBLIC_FPJS_PUBLIC_API_KEY is not set')
  }

  return apiKey
}

const fpjsPublicApiKey = getPublicApiKey()

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
        <FingerprintProvider apiKey={fpjsPublicApiKey}>{children}</FingerprintProvider>
      </body>
    </html>
  )
}

export default RootLayout
