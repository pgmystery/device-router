import React, { useState } from "react"

import EShell from '../eshell/EShell'
// import { MainSocketContext } from '../../App'


function EShellPage({ mainSocket }) {
  const eshell = new EShell()
  const [eshellSession, setEshellSession] = useState(  // Only in a state it works best...
    eshell.createSession({
      query: {  // TODO: CHANGE THIS TO A BETTER AUTH!
        type: 'user',
        userToken: mainSocket.id,
        deviceId: 0,  // TODO: GET THE ID FROM THE DB
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
      return eshellConnectButton({ onClick: stopEshellConnection, text: 'Stop connection...' })
    }
    return eshellConnectButton({ onClick: startEshellConnection, text: 'Start connection...', disabled: eshellConnectionStarted })
  }

  function eshellConnectButton({ onClick, text, disabled=null }) {
    // TODO: Style the Button with styled-components
    return (
      <button
        onClick={onClick}
        style={{
          padding: 10,
          marginBottom: 10
        }}
        disabled={disabled}
      >{text}</button>
    )
  }

  return (
    <>
    {/*<MainSocketContext.Consumer>*/}
    {/*  {mainSocket => <EShell mainSocket={mainSocket}/>}*/}
    {/*</MainSocketContext.Consumer>*/}
    <div>
      { getEshellConnectButton() }
      { eshellSession.term }
    </div>
    </>
  )
}

export default EShellPage
