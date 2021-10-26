import React from 'react'
import { GoogleTagManager as PartyTownGoogleTagManager } from '@builder.io/partytown/react'

const GoogleTagManagerHead = ({ id }) => {
  return <PartyTownGoogleTagManager containerId={id} />
}

GoogleTagManagerHead.ssr = true

export default GoogleTagManagerHead
