export const FPJS_API_KEY = process.env.REACT_APP_FPJS_PUBLIC_API_KEY ?? 'test_public_key'

// Optional. Defaults to the SDK's default region (us) when unset or invalid.
const rawRegion = process.env.REACT_APP_FPJS_REGION
export const FPJS_REGION = rawRegion === 'us' || rawRegion === 'eu' || rawRegion === 'ap' ? rawRegion : undefined
