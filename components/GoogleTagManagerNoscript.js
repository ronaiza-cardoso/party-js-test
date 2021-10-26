import React from 'react'
import { GoogleTagManagerNoScript as PartyTownGoogleTagManagerNoScript } from '@builder.io/partytown/react'

const GoogleTagManagerNoscript = ({ id }) => (
  <PartyTownGoogleTagManagerNoScript containerId={id} />
)

GoogleTagManagerNoscript.ssr = true
GoogleTagManagerNoscript.displayName = 'GoogleTagManagerNoscript'

export default GoogleTagManagerNoscript

// import React from 'react'
// import { string, shape } from 'prop-types'

// const GoogleTagManagerNoscript = ({ id }) => (
//   <noscript
//     // eslint-disable-next-line react/no-danger
//     dangerouslySetInnerHTML={{
//       __html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}" width="0" heigth="0" style="display:none;visibility:hidden"></iframe></noscript>`
//     }}
//   />
// )

// GoogleTagManagerNoscript.ssr = true
// GoogleTagManagerNoscript.displayName = 'GoogleTagManagerNoscript'

// export default GoogleTagManagerNoscript
