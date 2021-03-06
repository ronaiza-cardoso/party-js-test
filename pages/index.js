import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID } = process.env
  function handleDataPush() {
    dataLayer.push({ event: 'button1-click' })
  }

  const setupContent = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}')
`

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />

        <script
          async
          type="text/partytown"
          src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: setupContent
          }}
        />
      </Head>

      <main className={styles.main}>
        <button onClick={handleDataPush}>Button 1</button>
      </main>
    </div>
  )
}
