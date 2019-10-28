import React, { useState, useEffect, useLayoutEffect } from "react"
import { connect } from 'react-redux'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'
import request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import Header from './EShellPage/Header'
import RunCommands from './EShellPage/RunCommands'
import closeFullscreenIcon from '../images/fullscreen_icon.svg'
import useWindowSize from '../../utils/hooks/useWindowSize'

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
  const [selectedDeviceId, setSelectedDeviceId] = useState()
  const [isQuickCommandsShowing, setIsQuickCommandsShowing] = useState(false)
  const [windowWidth, windowHeight] = useWindowSize()

  useEffect(() => {
    getDeviceList().then(deviceList => setDevices(deviceList.devices))
    if (location.device) {
      startEshellConnection(location.device._id)
    }
  }, [])

  useLayoutEffect(() => {

  }, [windowWidth, windowHeight])

  function createEShellSession(deviceId=null) {
  let currentEShellSessions = eshellSessions

    if (currentEShellSession) {
      currentEShellSession.remove()
      const sessionIndex = currentEShellSessions.indexOf(currentEShellSession)
      currentEShellSessions = [
        ...currentEShellSessions.slice(0, sessionIndex),
        ...currentEShellSessions.slice(sessionIndex + 1)
      ]
    }

    const newSession = 
      eshell.createSession({
        data: {
          userId: session.id,
          deviceId: deviceId ? deviceId : selectedDeviceId,
        },
        termCallbacks: {
          fullsreen: currentSessionFullscreen,
        }
      })

    setCurrentEShellSession(newSession)

    currentEShellSessions = [
      ...currentEShellSessions,
      newSession,
    ]

    setEshellSessions(currentEShellSessions)
    return newSession
  }

  function startEshellConnection(deviceId=null) {
    setEshellConnectionStarted(true)

    const newSession = createEShellSession(deviceId)

    const eshellSocket = newSession.connect()

    eshellSocket.on('connect', () => setEshellConnected(true))

    eshellSocket.on('disconnect', () => {
      setEshellConnected(false)
      setEshellConnectionStarted(false)
    })
  }

  function stopEshellConnection() {
    currentEShellSession.disconnect()
  }

  function sendCMD(cmd) {
    currentEShellSession.emit(cmd + '\n')
  }

  return (
    <EShellPageStyled>
      <WrapperStyled flex={true}>
        <Header
          connectToDevice={location.device}
          devices={devices}
          eshellConnected={eshellConnected}
          createSessionHandler={startEshellConnection}
          stopSessionHandler={stopEshellConnection}
          setSelectedDeviceId={setSelectedDeviceId}
          disableConnectButton={eshellConnectionStarted || devices.length === 0}
          toggleShellFullscreen={() => {
            setCurrentSessionFullscreen(!currentSessionFullscreen)}
          }
          toggleQuickCommands={() => setIsQuickCommandsShowing(!isQuickCommandsShowing)}
        />
      </WrapperStyled>
      { eshellSessions.length > 0
          ? <EShellPageWrapper>
            {
              eshellSessions.map(session => <EShellTermStyld
                key={session.sessionId}
                input={session.input}
                output={session.output}
                onWindowSizeChanged={session.onWindowSizeChanged}
                fullscreen={currentSessionFullscreen}
                minusSize={200}
              />)
            }
            {
              isQuickCommandsShowing
                && <RunCommands sendCMD={sendCMD}></RunCommands>
            }
            </EShellPageWrapper>
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
    </EShellPageStyled>
  )

  function getDeviceList() {
    return request.get({url: '/api/device?online=true'})
  }
}

const EShellPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  height: 100%;
`

const WrapperStyled = styled(Wrapper)`
  flex-shrink: 0;
  height: auto;
`

const EShellPageWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  margin-bottom: 20px;
  padding: 0 12px;
`

const EShellTermStyld = styled(EShellTerm)`
  flex-grow: 1;
`

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
