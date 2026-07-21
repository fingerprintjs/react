import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useVisitorData } from '@fingerprint/react'

const Home: NextPage = () => {
  const { isLoading, error, data } = useVisitorData({ immediate: true })

  const reloadData = () => {
    //getData({ ignoreCache: true })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Fingerprint React SDK Next.js Demo</title>
        <meta name='description' content='Check if the Fingerprint React SDK integration works with Next.js SSR' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

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
          Visitor ID:{' '}
          <span data-testid='visitor-id' className={styles.visitorId}>
            {isLoading ? 'Loading...' : data?.visitor_id}
          </span>
        </h4>
        <h4>Full visitor data:</h4>
        <pre className={styles.data}>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Home
