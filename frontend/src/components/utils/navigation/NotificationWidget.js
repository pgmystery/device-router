import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import { MainSocketContext } from '../../../socketio/MainSocketContext'

import bellIcon from '../../images/bell.svg'
import bellActiveIcon from '../../images/bellActive.svg'
import removeIcon from '../../images/deleteIcon.svg'
import Popover from '../Popover'


function NotificationWidget() {
  const [isNewNotification, setIsNewNotification] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [newNotifications, setNewNotifications] = useState([])
  const { addMainSocketListeners, mainSocket } = useContext(MainSocketContext)

  useEffect(() => {
    addMainSocketListeners([
      ['notification', addNotification],
      ['notifications', setNewNotifications]
    ])
  }, [])

  useEffect(() => {
    if (isMenuOpen && isNewNotification) {
      let changed = false

      notifications.forEach(notification => {
        if (notification.new) {
          notification.new = false
          changed = true
        }
      })
      if (changed) {
        mainSocket.emit('notificationsReaded')
      }
      setIsNewNotification(false)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (newNotifications.length > 0) {
      addNotifications(newNotifications)
    } 
  }, [newNotifications])


  function addNotification(newNotification) {
    setNewNotifications([newNotification])
  }

  function addNotifications(newNotifications) {
    let newNotifi = false
    newNotifications.forEach(notification => {
      if (isMenuOpen) {
        notification.new = false
      }
      else {
        if (notification.new) {
          newNotifi = true
        }
      }
    })

    setNotifications([
      ...newNotifications,
      ...notifications,
    ])

    if (isMenuOpen) {
      setIsNewNotification(false)
      mainSocket.emit('notificationsReaded')
    }
    else {
      setIsNewNotification(newNotifi)
    }

    setNewNotifications([])
  }

  function removeNotification(index) {
    const notification = notifications[index]

    mainSocket.emit('notificationDelete', notification._id)

    setNotifications([
      ...notifications.slice(0, index),
      ...notifications.slice(index + 1),
    ])
  }

  function handleClick(event) {
    event.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <NotificationWidgetStyled>
      <div onClick={handleClick}>
        {
          isNewNotification
            ? <NotificationBellActice>
                <ReactSVG
                  src={bellActiveIcon} 
                  beforeInjection={svg => {
                    svg.setAttribute('style', 'width: 32px; height: 32px; fill: #d77237;')
                }} />
              </NotificationBellActice>
            : <ReactSVG
                src={bellIcon} 
                beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 32px; height: 32px;')
              }} />
        }
          <NotificationWidgetCounter>{notifications.length}</NotificationWidgetCounter>
      </div>
      { isMenuOpen
        && <NotificationWidgetPopoverStyled
          header='Notifications'
          body={
            notifications.length > 0
              ? notifications.map((notification, index) => <NotificationItem
                title={notification.title}
                msg={notification.msg}
                index={index}
                onDelete={removeNotification}
                key={index}
              />)
              : <NoNotificationsText>No new Notifications</NoNotificationsText>
          }
        />
      }
    </NotificationWidgetStyled>
  )
}


NotificationWidgetCounter.propTypes = {
  children: PropTypes.number
}

NotificationWidgetCounter.defaultTypes = {
  children: '(NO NOTIFICATIONS)'
}

function NotificationWidgetCounter({ children }) {
  return (
    <NotificationWidgetCounterStyled>{children}</NotificationWidgetCounterStyled>
  )
}

function NotificationItem({ title, msg, index, onDelete }) {
  return (
    <NotificationItemStyled>
      <NotificationItemText>{msg}</NotificationItemText>
      <NotificationItemIcon>
        <ReactSVG
          src={removeIcon}
          onClick={() => onDelete(index)}
          beforeInjection={svg => {
            svg.setAttribute('style', 'width: 32px; height: 32px; fill: #e15e5ede;')
          }}
        />
      </NotificationItemIcon>
    </NotificationItemStyled>
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

const NotificationBellActice = styled.div`
    z-index: 1;
    animation-name: notification-alert;
    animation-duration: 200ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-direction: alternate-reverse;

  @keyframes notification-alert {
      from {
          transform:rotate(-10deg);
      }
      to {
          transform:rotate(10deg);
      }
  }
`

const NotificationWidgetPopoverStyled = styled(Popover)`
  right: 0;
`

const NotificationItemStyled = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  :hover {
    background-color: #f7f8f9;
  }
`

const NotificationItemText = styled.p`
  flex: 5;
  text-align: center;
`

const NotificationItemIcon = styled.div`
  flex: 1;
  margin: auto;
`

const NoNotificationsText = styled.p`
  text-align: center;
  padding: 20px;
`


export default NotificationWidget
