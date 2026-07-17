import { FingerprintProvider } from '@fingerprint/react'
import { Outlet } from 'react-router-dom'
import { Nav } from '../shared/components/Nav'
import { FPJS_API_KEY, FPJS_REGION } from '../shared/utils/env'

function SessionStorageCache() {
  return (
    <FingerprintProvider
      apiKey={FPJS_API_KEY}
      region={FPJS_REGION}
      cache={{ storage: 'sessionStorage', duration: 60 * 5 }}
    >
      <div className='App'>
        <header className='header'>
          <h2>Solution with a custom implementation of a session storage cache</h2>
          <div className='subheader'>New API call made after a key expires or is cleared from the local storage</div>
        </header>
        <Nav />
        <Outlet />
      </div>
    </FingerprintProvider>
  )
}

export default SessionStorageCache
