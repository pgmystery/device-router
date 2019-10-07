import React from 'react'
import styled from 'styled-components'

import LinkUnstyled from '../../utils/LinkUnstyled'
import Button, { ButtonPrimary, ButtonSuccess } from '../../utils/Button'
import ReactSVG from 'react-svg'
import plusIcon from '../../images/plus_icon.svg'
import reloadIcon from '../../images/reload_icon.svg'


function DeviceRegisterHeader({ refreshClick }) {
  return (
    <DeviceRegisterHeaderStyled>
      <DeviceRegisterHeaderLeft>
        <ButtonPrimary>Download Rounector</ButtonPrimary>
      </DeviceRegisterHeaderLeft>
      <DeviceRegisterHeaderRight>
        <LinkUnstyled to='/registerlist/new' color={'#ffffff'}>
          <CreateRegisterTokenButton>
            Create Register-Token
            <ReactSVG src={plusIcon} beforeInjection={svg => {
                svg.setAttribute('style', 'width: 24px; height: 24px; display: flex; fill: #ffffff; margin-left: 10px;')
              }}
            />
          </CreateRegisterTokenButton>
        </LinkUnstyled>
        <RefreshButton onClick={refreshClick}>
          <ReactSVG src={reloadIcon} beforeInjection={svg => {
              svg.setAttribute('style', 'width: 26px; height: 26px; display: flex; fill: #000000;')
            }}
          />
        </RefreshButton>
      </DeviceRegisterHeaderRight>
    </DeviceRegisterHeaderStyled>
  )
}

const DeviceRegisterHeaderStyled = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  height: 76px;
`

const DeviceRegisterHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

const DeviceRegisterHeaderRight = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`

const RefreshButton = styled(Button)`
  border-radius: 50%;
  padding: 6px;
  height: 38px;
`

const CreateRegisterTokenButton = styled(ButtonSuccess)`
  margin: 0;
`


export default DeviceRegisterHeader
