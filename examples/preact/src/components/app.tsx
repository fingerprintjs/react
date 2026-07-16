import { FunctionalComponent } from 'preact'
import { useVisitorData } from '@fingerprint/react'

const App: FunctionalComponent = () => {
  const { isLoading, error, data, getData } = useVisitorData({ immediate: true })

  const reloadData = (): void => {
    void getData()
  }

  return (
    <div id='preact_root' className='container'>
      <h1>Fingerprint React SDK Preact Demo</h1>
      <div className='testArea'>
        <div className='description'>Lets load Fingerprint using the React SDK and check the following:</div>
        <ol className='actionPoints'>
          <li>There are no errors on the server</li>
          <li>There are no errors on the client</li>
          <li>The visitor data is loaded in the field below</li>
          <li>Try controls to test additional parameters</li>
        </ol>
        <div className='controls'>
          <button onClick={reloadData} type='button'>
            Reload data
          </button>
        </div>
        <h4>
          VisitorId: <span className='visitorId'>{isLoading ? 'Loading...' : data?.visitor_id}</span>
        </h4>
        <h4>Full visitor data:</h4>
        <pre className='data'>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App
