import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { FingerprintProvider } from '@fingerprint/react'

const apiKey = import.meta.env.VITE_FPJS_PUBLIC_API_KEY
if (apiKey === undefined || apiKey === '') {
  throw new Error('VITE_FPJS_PUBLIC_API_KEY is not set')
}

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <FingerprintProvider apiKey={apiKey}>
      <App />
    </FingerprintProvider>
  </StrictMode>
)
