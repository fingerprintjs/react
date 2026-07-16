'use client'

import styles from '../styles/Home.module.css'
import { useVisitorData } from '@fingerprint/react'

const HomePage = () => {
  const { isLoading, error, data, getData } = useVisitorData({ immediate: true })

  const reloadData = () => {
    void getData({})
  }

  return (
    <div className={styles.container}>
      <h1>Fingerprint React SDK Next.js Demo</h1>
      <div className={styles.testArea}>
        <div className={styles.description}>Lets load Fingerprint using the React SDK and check the following:</div>
        <ol className={styles.actionPoints}>
          <li>There are no errors on the server</li>
          <li>There are no errors on the client</li>
          <li>The visitor data is loaded in the field below</li>
          <li>Try controls to test additional parameters</li>
        </ol>
        <div className={styles.controls}>
          <button onClick={reloadData} type='button'>
            Reload data
          </button>
        </div>
        <h4>
          VisitorId: <span className={styles.visitorId}>{isLoading ? 'Loading...' : data?.visitor_id}</span>
        </h4>
        <h4>Full visitor data:</h4>
        <pre className={styles.data}>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

export default HomePage
