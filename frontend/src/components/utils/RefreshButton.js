import React from 'react'
import styled from 'styled-components/macro'
import ReactSVG from 'react-svg'

import Button from './Button'
import reloadIcon from '../images/reload_icon.svg'


function RefreshButton({ onClick }) {
  return (
    <RefreshButtonStyled onClick={onClick} popover={'Refresh'}>
      <ReactSVG src={reloadIcon} beforeInjection={svg => {
          svg.setAttribute('style', 'width: 26px; height: 26px; display: flex; fill: #000000;')
        }}
      />
    </RefreshButtonStyled>
  )
}

const RefreshButtonStyled = styled(Button)`
  border-radius: 50%;
  padding: 6px;
  height: 38px;
  user-select: none;
`


export default RefreshButton
