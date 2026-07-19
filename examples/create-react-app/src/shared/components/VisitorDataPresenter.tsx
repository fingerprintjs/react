import { Fingerprint } from '@fingerprint/react'

function VisitorDataPresenter({
  data,
  isLoading,
  error,
}: {
  data?: Fingerprint.GetResult
  isLoading?: boolean
  error?: Error
}) {
  if (error) {
    return <p>An error occurred: {error.message}</p>
  }

  return (
    <div className='visitor-data'>
      <p>
        <b>Visitor ID:</b>{' '}
        <span data-testid='visitor-id'>
          {isLoading === true ? 'Loading...' : (data?.visitor_id ?? 'not established yet')}
        </span>
      </p>
      {data !== undefined && (
        <>
          <p>
            <b>Full visitor data:</b>
          </p>
          <pre className='details'>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </div>
  )
}

export default VisitorDataPresenter
