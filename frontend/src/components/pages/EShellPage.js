import React, { useState, useEffect, useRef } from "react"
import styled from 'styled-components/macro'
import Request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import Header from './EShellPage/Header'

import EShell from '../../eshell/EShell'


function EShellPage({ location }) {
  const [devices, setDevices] = useState([])
  const [eshell, setEshell] = useState(new EShell())
  const [eshellSession, setEshellSession] = useState([])
  const [eshellConnectionStarted, setEshellConnectionStarted] = useState(false)
  const [eshellConnected, setEshellConnected] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState()

  useEffect(() => {
    getDeviceList().then(deviceList => setDevices(deviceList.devices))
  }, [])

  function createEShellSession() {
    const newSession = 
      eshell.createSession({
        query: {  // TODO: Change this to a better auth!
          type: 'user',
          // userToken: mainSocket.id,
          deviceId: selectedDevice,  // TODO: Get the device-id from the db
        }
      })
    setEshellSession([
      ...eshellSession,
      newSession,
    ])
    return newSession
  }

  function startEshellConnection() {
    setEshellConnectionStarted(true)

    const newSession = createEShellSession()

    const eshellSocket = newSession.connect()

    eshellSocket.on('connect', () => setEshellConnected(true))

    eshellSocket.on('disconnect', () => {
      setEshellConnected(false)
      setEshellConnectionStarted(false)
    })
  }

  function stopEshellConnection() {
    eshellSession.disconnect()
  }

  function createSessionHandler(event) {
    startEshellConnection(selectedDevice)
  }

  return (
    <Wrapper>
      <Header
        devices={devices}
        eshellConnected={eshellConnected}
        createSessionHandler={createSessionHandler}
        setSelectedDevice={setSelectedDevice}
        disableConnectButton={eshellConnectionStarted || devices.length === 0}
      />
      { eshellSession.length > 0
          ? eshellSession[0].term
          : <NoSessionsText>No EShell-Sessions...</NoSessionsText>
      }
    </Wrapper>
  )

  function getDeviceList() {
    const request = new Request('/api/device?online=true')
    return request.get()
  }
}

const NoSessionsText = styled.p`
  color: #a6a6a6;
  font-size: 1.3em;
  padding: 20px;
  width: 100%;
  text-align: center;
`

export default EShellPage
