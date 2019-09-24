import React, { useState } from "react"

import { mainSocket } from '../App'
import EShell from '../eshell/EShell'
import Button from "../utils/Button"


function EShellPage() {
  const eshell = new EShell()
  const [eshellSession, setEshellSession] = useState(  // Only in a state it works best...
    eshell.createSession({
      query: {  // TODO: Change this to a better auth!
        type: 'user',
        userToken: mainSocket.id,
        deviceId: 0,  // TODO: Get the device-id from the db
      }
    })
  )
  const [eshellConnectionStarted, setEshellConnectionStarted] = useState(false)
  const [eshellConnected, setEshellConnected] = useState(false)

  function startEshellConnection() {
    setEshellConnectionStarted(true)

    const eshellSocket = eshellSession.connect()

    eshellSocket.on('connect', () => setEshellConnected(true))

    eshellSocket.on('disconnect', () => {
      setEshellConnected(false)
      setEshellConnectionStarted(false)
    })
  }

  function stopEshellConnection() {
    eshellSession.disconnect()
  }

  function getEshellConnectButton() {
    if (eshellConnected) {
      return eshellConnectButton({
        onClick: stopEshellConnection,
        text: 'Stop connection...'
      })
    }
    return eshellConnectButton({
      onClick: startEshellConnection,
      text: 'Start connection...',
      disabled: eshellConnectionStarted
    })
  }

  function eshellConnectButton({ onClick, text, disabled=null }) {
    return (
      <Button 
        onClick={onClick}
        disabled={disabled}
      >{text}</Button>
    )
  }

  return (
    <div>
      { getEshellConnectButton() }
      { eshellSession.term }
    </div>
  )
}

export default EShellPage
