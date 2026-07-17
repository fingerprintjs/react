import { FingerprintProvider } from '@fingerprint/react'
import { Outlet } from 'react-router-dom'
import { FPJS_API_KEY, FPJS_REGION } from '../shared/utils/env'
import { Nav } from '../shared/components/Nav'

function InMemoryCache() {
  return (
    <FingerprintProvider
      apiKey={FPJS_API_KEY}
      region={FPJS_REGION}
      cache={{ storage: 'agent', duration: 'optimize-cost' }}
    >
      <div className='App'>
        <header className='header'>
          <h2>Solution with an in-memory cache</h2>
          <div className='subheader'>
            New API call made after a key expires, a page is reloaded or the provider is unmounted
          </div>
        </header>
        <Nav />
        <Outlet />
      </div>
    </FingerprintProvider>
  )
}

export default InMemoryCache
