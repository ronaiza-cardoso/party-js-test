import Head from 'next/head'
import { Partytown } from '@builder.io/partytown/react'

import '../styles/globals.css'
import GoogleTagManagerHead from '../components/GoogleTagManagerHead'
import GoogleTagManagerNoscript from '../components/GoogleTagManagerNoscript'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <GoogleTagManagerHead containerId={process.env.NEXT_PUBLIC_GTM} />
        <GoogleTagManagerNoscript containerId={process.env.NEXT_PUBLIC_GTM} />
        <Partytown
          debug
          logCalls
          logGetters
          logSetters
          logImageRequests
          logScriptExecution
          logSendBeaconRequests
          logStackTraces
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
