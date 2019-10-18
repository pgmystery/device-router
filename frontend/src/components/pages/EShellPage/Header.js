import React, { useState } from 'react'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'

import PageHeader from '../../utils/PageHeader'
import Button, { ButtonSuccess } from '../../utils/Button'
import Select, { Option } from '../../utils/Select'
import settingsIcon from '../../images/settings.svg'
import fullscreenIcon from '../../images/fullscreen2_icon.svg'
import searchIcon from '../../images/search.svg'


function Header({ disableConnectButton, devices, eshellConnected, createSessionHandler, setSelectedDevice }) {
  function getEshellConnectButton() {
    if (eshellConnected) {
      return eshellConnectButton({
        // onClick: stopEshellConnection,
        text: 'Stop connection...'
      })
    }
    return eshellConnectButton({
      onClick: createSessionHandler,
      text: 'Create Session',
      disabled: disableConnectButton,
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

  function selectChangeHandler(e) {
    const index = e.target.selectedIndex
    const optionElement = e.target.childNodes[index]
    setSelectedDevice(optionElement.dataset.id)
  }

  function leftHeader() {
    return (
      <>
        {
          devices && devices.length > 0 &&
          (setSelectedDevice(devices[0]._id))
        }
          <Select list={true} onChange={selectChangeHandler}>
            {devices.map(device => (
              <Option key={device._id} data-id={device._id}>{device.name}</Option>
            ))}
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

  return (
    <PageHeaderStyled leftComponent={ leftHeader() } rightComponent={ rightHeader() } />
  )
}

const PageHeaderStyled = styled(PageHeader)`
  height: auto;
`

const StartSessionForm = styled.form`
  display: flex;
  align-items: center;
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


export default Header