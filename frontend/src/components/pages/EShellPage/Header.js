import React from 'react'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'

import PageHeader from '../../utils/PageHeader'
import Button, { ButtonSuccess, ButtonDanger } from '../../utils/Button'
import Select, { Option } from '../../utils/Select'
import fullscreenIcon from '../../images/fullscreen2_icon.svg'
import runIcon from '../../images/runIcon.svg'


function Header({
  connectToDevice,
  disableConnectButton,
  devices,
  eshellConnected,
  createSessionHandler,
  stopSessionHandler,
  setSelectedDeviceId,
  toggleShellFullscreen,
  toggleQuickCommands,
}) {

  function getEshellConnectButton() {
    return (
      <ButtonSuccess
        onClick={() => createSessionHandler()}
        disabled={disableConnectButton}
      >Connect</ButtonSuccess>
    )
  }

  function getEshellDisconnectButton() {
    return (
      <ButtonDanger
        onClick={stopSessionHandler}
      >Stop Connection</ButtonDanger>
    )
  }

  function selectChangeHandler(e) {
    const index = e.target.selectedIndex
    const optionElement = e.target.childNodes[index]
    setSelectedDeviceId(optionElement.dataset.id)
  }

  function leftHeader() {
    return (
      <>
        {
          devices && devices.length > 0 &&
          (setSelectedDeviceId(devices[0]._id))
        }
          <Select list={true} onChange={selectChangeHandler} disabled={eshellConnected} value={connectToDevice && connectToDevice.name}>
            {devices.map(device => (
              <Option key={device._id} data-id={device._id}>{device.name}</Option>
            ))}
          </Select>
        {
          eshellConnected
            ? getEshellDisconnectButton()
            : getEshellConnectButton()
        }
      </>
    )
  }

  function rightHeader() {
    return (
      <>
        {eshellConnected &&
          <>
            <IconButton onClick={toggleQuickCommands} tooltip={"Run command"}>
              <ReactSVG src={runIcon} beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 24px; height: 30px; display: flex; fill: #6f6f6f;')
                }}
              />
            </IconButton>
            <IconButton onClick={toggleShellFullscreen} tooltip={"Fullscreen"}>
              <ReactSVG src={fullscreenIcon} beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 24px; height: 30px; display: flex; fill: #6f6f6f;')
                }}
              />
            </IconButton>
          </>
        }
      </>
    )
  }

  return (
    <PageHeader leftComponent={ leftHeader() } rightComponent={ rightHeader() } />
  )
}

const IconButton = styled(Button)`
  display: inline-flex;
  padding: 0;
  margin: 0 0 0 5px;
  min-height: 35px;
  min-width: 35px;
  border: 1px solid #c9c9ca;
  background-color: #fff;
  border-radius: 4px;
  height: 35px;
`


export default Header
