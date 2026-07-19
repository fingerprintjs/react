import { useVisitorData } from '@fingerprint/react'

function App() {
  const { isLoading, error, data } = useVisitorData()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>An error occurred: {error.message}</div>
  }
  if (data?.visitor_id === undefined || data.visitor_id === '') {
    return null
  }

  return (
    <div>
      Visitor ID: <span data-testid='visitor-id'>{data.visitor_id}</span>
    </div>
  )
}

export default App
