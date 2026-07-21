import { FunctionalComponent } from 'preact'
import './style/index.css'
import App from './components/app'
import { FingerprintProvider } from '@fingerprint/react'

const WrappedApp: FunctionalComponent = () => {
  const apiKey = process.env.PREACT_APP_FPJS_PUBLIC_API_KEY
  if (apiKey === undefined || apiKey === '') {
    throw new Error('PREACT_APP_FPJS_PUBLIC_API_KEY is not set')
  }

  // Optional. Defaults to the SDK's default region (us) when unset or invalid.
  const rawRegion = process.env.PREACT_APP_FPJS_REGION
  const region = rawRegion === 'us' || rawRegion === 'eu' || rawRegion === 'ap' ? rawRegion : undefined

  return (
    <FingerprintProvider apiKey={apiKey} region={region}>
      <App />
    </FingerprintProvider>
  )
}

export default WrappedApp
