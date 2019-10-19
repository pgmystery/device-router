import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'
import request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import Header from './EShellPage/Header'
import closeFullscreenIcon from '../images/fullscreen_icon.svg'

import EShell from '../../eshell/EShell'
import EShellTerm from "../../eshell/EShellTerm"


const mapStateToProps = ({ session }) => ({
  session
})

function EShellPage({ session, location }) {
  const [devices, setDevices] = useState([])
  const [eshell, setEshell] = useState(new EShell())
  const [eshellSessions, setEshellSessions] = useState([])
  const [currentEShellSession, setCurrentEShellSession] = useState(null)
  const [currentSessionFullscreen, setCurrentSessionFullscreen] = useState(false)
  const [eshellConnectionStarted, setEshellConnectionStarted] = useState(false)
  const [eshellConnected, setEshellConnected] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState()

  useEffect(() => {
    getDeviceList().then(deviceList => setDevices(deviceList.devices))
  }, [])

  function createEShellSession() {
    if (currentEShellSession) {
      currentEShellSession.remove()
    }
    const newSession = 
      eshell.createSession({
        data: {
          userId: session.id,
          deviceId: selectedDevice,
        },
        termCallbacks: {
          fullsreen: currentSessionFullscreen,
        }
      })

    setCurrentEShellSession(newSession)
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
    currentEShellSession.disconnect()
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
        toggleShellFullscreen={() => {
          console.log('SET FULLSCREEN')
          setCurrentSessionFullscreen(!currentSessionFullscreen)}}
      />
      { eshellSessions.length > 0
          ? <EShellTerm input={currentEShellSession.input} output={currentEShellSession.output} fullscreen={currentSessionFullscreen}/>
          : <NoSessionsText>No EShell-Sessions...</NoSessionsText>
      }
      {
        currentSessionFullscreen
        && <CloseFullscreenButton onClick={() => setCurrentSessionFullscreen(false)}>
            <ReactSVG src={closeFullscreenIcon} beforeInjection={svg => {
                svg.setAttribute('style', 'width: 48px; height: 48px; fill: #ffffff;')
              }}/>
          </CloseFullscreenButton>
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

const CloseFullscreenButton = styled.button`
  z-index: 255;
  position: fixed;
  border-radius: 10%;
  right: 25px;
  top: 5px;
  width: 50px;
  height: 50px;
  opacity: 0.3;
  background-color: transparent;
  color: #ffffff;
  font-size: 30px;
  padding: 0;
  border: 1px solid #b9b9b9;

  :hover {
    opacity: 0.5;
    color: #ffffff;
    cursor: pointer;
  }

  :active {
    opacity: 0.4;
  }
`


export default connect(
  mapStateToProps
)(EShellPage)
