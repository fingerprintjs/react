import React from 'react'
import { createRoot } from 'react-dom/client'
import { FingerprintProvider } from '@fingerprint/react'
import App from './App'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
const apiKey = process.env.REACT_APP_FPJS_PUBLIC_API_KEY
// Optional. Defaults to the SDK's default region (us) when unset or invalid.
const rawRegion = process.env.REACT_APP_FPJS_REGION
const region = rawRegion === 'us' || rawRegion === 'eu' || rawRegion === 'ap' ? rawRegion : undefined

root.render(
  <React.StrictMode>
    <FingerprintProvider apiKey={apiKey} region={region}>
      <App />
    </FingerprintProvider>
  </React.StrictMode>
)
