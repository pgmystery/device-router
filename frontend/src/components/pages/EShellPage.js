import React, { useState, useEffect } from "react"
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'
import Request from '../../utils/Request'

import Wrapper from '../utils/Wrapper'
import PageHeader from '../utils/PageHeader'

import EShell from '../../eshell/EShell'
import Button, { ButtonSuccess } from "../utils/Button"
import Select, { Option } from '../utils/Select'
import settingsIcon from '../images/settings.svg'
import fullscreenIcon from '../images/fullscreen2_icon.svg'
import searchIcon from '../images/search.svg'


function EShellPage({ location }) {
  const [devices, setDevices] = useState([])
  const [eshell, setEshell] = useState(new EShell())
  const [eshellSession, setEshellSession] = useState([])
  const [eshellConnectionStarted, setEshellConnectionStarted] = useState(false)
  const [eshellConnected, setEshellConnected] = useState(false)

  useEffect(() => {
    getDeviceList().then(deviceList => setDevices(deviceList.devices))
    createEShellSession()
  }, [])

  // console.log(location.device)
  // console.log(eshellSession)

  function createEShellSession() {
    setEshellSession([
      ...eshellSession,
      eshell.createSession({
        query: {  // TODO: Change this to a better auth!
          type: 'user',
          // userToken: mainSocket.id,
          deviceId: 0,  // TODO: Get the device-id from the db
        }
      })
    ])
  }

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
      disabled: eshellConnectionStarted || devices.length === 0
    })
  }

  function eshellConnectButton({ onClick, text, disabled=false }) {
    return (
      <ButtonSuccess 
        onClick={onClick}
        disabled={disabled}
      >{text}</ButtonSuccess>
    )
  }

  return (
    <Wrapper>
      <PageHeaderStyled leftComponent={ leftHeader() } rightComponent={ rightHeader() } />
      { eshellSession.length > 0 && eshellSession[0].term }
    </Wrapper>
  )

  function leftHeader() {
    return (
      <>
        <Select list={true}>
          {
            devices &&
            devices.map(device => (
              <Option key={device._id}>{device.name}</Option>
            ))
          }
        </Select>
        { getEshellConnectButton() }
      </>
    )
  }

  function rightHeader() {
    return (
      <>
        <IconButton>
          <ReactSVG src={searchIcon} beforeInjection={svg => {
              svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #6f6f6f;')
            }}
          />
        </IconButton>
        <IconButton>
          <ReactSVG src={fullscreenIcon} beforeInjection={svg => {
              svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #6f6f6f;')
            }}
          />
        </IconButton>
        <IconButton>
          <ReactSVG src={settingsIcon} beforeInjection={svg => {
              svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #6f6f6f;')
            }}
          />
        </IconButton>
      </>
    )
  }

  function getDeviceList() {
    const request = new Request('/api/device?online=true')
    return request.get()
  }
}

const PageHeaderStyled = styled(PageHeader)`
  height: auto;
`

const IconButton = styled(Button)`
  display: inline-flex;
  padding: 0;
  margin: 0 0 0 5px;
  min-height: 32px;
  min-width: 32px;
  border: 1px solid #c9c9ca;
  background-color: #fff;
  border-radius: 4px;
`

export default EShellPage
