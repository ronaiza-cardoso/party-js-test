import Head from 'next/head'
import { Partytown } from '@builder.io/partytown/react'

import '../styles/globals.css'
import GoogleTagManagerHead from '../components/GoogleTagManagerHead'
import GoogleTagManagerNoscript from '../components/GoogleTagManagerNoscript'

function MyApp({ Component, pageProps }) {
  const partytown = {
    debug: true,
    forward: [['dataLayer', 1]],
    logCalls: true,
    logGetters: true,
    logSetters: true,
    logImageRequests: true,
    logMainAccess: true,
    logSendBeaconRequests: true,
    logStackTraces: false,
    logScriptExecution: true
  }
  return (
    <>
      <Head>
        <GoogleTagManagerHead containerId={process.env.NEXT_PUBLIC_GTM} />
        <GoogleTagManagerNoscript containerId={process.env.NEXT_PUBLIC_GTM} />
        <script
          dangerouslySetInnerHTML={{
            __html: partytown
          }}
        />
        <script async src="/~partytown/debug/partytown-snippet.js" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
