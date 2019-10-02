import React, { useState } from 'react'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import bellIcon from '../../images/bell.svg'
import bellActiveIcon from '../../images/bellActive.svg'
import Popover from '../Popover'


function NotificationWidget({ notifications }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleClick(event) {
    event.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <NotificationWidgetStyled onClick={handleClick}>
      <ReactSVG
        src={bellIcon} 
        beforeInjection={svg => {
          svg.setAttribute('style', 'width: 32px; height: 32px;')
        }} />
        <NotificationWidgetCounter>{notifications.length}</NotificationWidgetCounter>
      { isMenuOpen && <NotificationWidgetPopoverStyled header='Notifications' body='BODY' /> }
    </NotificationWidgetStyled>
  )
}

function NotificationWidgetCounter({ children }) {
  return (
    <NotificationWidgetCounterStyled>{children}</NotificationWidgetCounterStyled>
  )
}

const NotificationWidgetStyled = styled.div`
  cursor: pointer;
  position: relative;
`

const NotificationWidgetCounterStyled = styled.p`
  color: #000000;
  margin: 0;
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 30px;
  padding: 3px 5px;
  font-size: 10px;
`

const NotificationWidgetPopoverStyled = styled(Popover)`
  right: 0;
`


export default NotificationWidget
