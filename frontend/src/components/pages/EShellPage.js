import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'
import styled from 'styled-components/macro'
import request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import Header from './EShellPage/Header'

import EShell from '../../eshell/EShell'


const mapStateToProps = ({ session }) => ({
  session
})

function EShellPage({ session, location }) {
  const [devices, setDevices] = useState([])
  const [eshell, setEshell] = useState(new EShell())
  const [eshellSessions, setEshellSessions] = useState([])
  const [eshellConnectionStarted, setEshellConnectionStarted] = useState(false)
  const [eshellConnected, setEshellConnected] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState()

  useEffect(() => {
    getDeviceList().then(deviceList => setDevices(deviceList.devices))
  }, [])

  function createEShellSession() {
    const newSession = 
      eshell.createSession({
        data: {
          userId: session.id,
          deviceId: selectedDevice,
        }
      })
    setEshellSessions([
      ...eshellSessions,
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
    console.log('DISCONNECT ESHELL: ', eshellSessions[0])
    eshellSessions[0].disconnect()
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
        stopSessionHandler={stopEshellConnection}
        setSelectedDevice={setSelectedDevice}
        disableConnectButton={eshellConnectionStarted || devices.length === 0}
      />
      { eshellSessions.length > 0
          ? eshellSessions[0].term
          : <NoSessionsText>No EShell-Sessions...</NoSessionsText>
      }
    </Wrapper>
  )

  function getDeviceList() {
    return request.get({url: '/api/device?online=true'})
  }
}

const NoSessionsText = styled.p`
  color: #a6a6a6;
  font-size: 1.3em;
  padding: 20px;
  width: 100%;
  text-align: center;
`

export default connect(
  mapStateToProps
)(EShellPage)
