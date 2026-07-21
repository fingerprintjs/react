import { Outlet } from 'react-router-dom'
import { Nav } from '../shared/components/Nav'
import { FPJS_API_KEY, FPJS_REGION } from '../shared/utils/env'
import { FingerprintProvider } from '@fingerprint/react'

function LocalStorageCache() {
  return (
    <FingerprintProvider
      apiKey={FPJS_API_KEY}
      region={FPJS_REGION}
      cache={{
        storage: 'localStorage',
        duration: 60 * 10,
        cachePrefix: 'MY_AWESOME_PREFIX',
      }}
    >
      <div className='App'>
        <header className='header'>
          <h2>Solution with a local storage cache</h2>
          <div className='subheader'>New API call made after a key expires or is cleared from the local storage</div>
        </header>
        <Nav />
        <Outlet />
      </div>
    </FingerprintProvider>
  )
}

export default LocalStorageCache
