import { FingerprintProvider } from '@fingerprint/react'
import { Outlet } from 'react-router-dom'
import { Nav } from '../shared/components/Nav'
import { FPJS_API_KEY, FPJS_REGION } from '../shared/utils/env'

function WithoutCache() {
  return (
    <FingerprintProvider apiKey={FPJS_API_KEY} region={FPJS_REGION}>
      <div className='App'>
        <header className='header'>
          <h2>Solution without cache</h2>
          <div className='subheader'>New API call made on every component render</div>
        </header>
        <Nav />
        <Outlet />
      </div>
    </FingerprintProvider>
  )
}

export default WithoutCache
