import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import { MainSocketContext } from '../../../socketio/MainSocketContext'

import bellIcon from '../../images/bell.svg'
import bellActiveIcon from '../../images/bellActive.svg'
import Popover from '../Popover'


function NotificationWidget() {
  console.log('START OF NOTIFICATION_WIDGET')

  const [isNewNotification, setIsNewNotification] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([1])
  const { addMainSocketListeners, mainSocket } = useContext(MainSocketContext)

  useEffect(() => {
    setNotifications([2, 3])

    addMainSocketListeners([
      ['notification', addNotification
      , [notifications]],
      ['notifications', addNotifications
      , [notifications]],
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


  function addNotification(newNotification) {
    console.log('NEW NOTIFICATION', notifications)
    addNotifications([newNotification])
  }

  function addNotifications(newNotifications) {
    // let newNotifi = false
    // newNotifications.forEach(notification => {
    //   isMenuOpen
    //     ? notification.new = false
    //     : newNotifi = notification.new
    // })

    console.log(notifications)

    // setNotifications([4, 5, 6])

    // setNotifications([
    //   ...newNotifications,
    //   ...notifications,
    // ])

    // isMenuOpen
    //   ? setIsNewNotification(false) && mainSocket.emit('notificationsReaded')
    //   : setIsNewNotification(newNotifi)
  }

  function removeNotification(index) {
    const notification = notifications[index]

    mainSocket.emit('notificationDelete', notification._id)

    // setNotifications([
    //   ...notifications.slice(0, index),
    //   ...notifications.slice(index + 1),
    // ])
  }

  function handleClick(event) {
    event.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  return useMemo(() => (
    <NotificationWidgetStyled>
      <div onClick={handleClick}>
        {
          isNewNotification
            ? <ReactSVG
                src={bellActiveIcon} 
                beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 32px; height: 32px; fill: #d77237;')
              }} />
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
              : <NoNotificationsText>No new Notifications :(</NoNotificationsText>
          }
        />
      }
    </NotificationWidgetStyled>
  ))
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
      <div>{title}</div>
      <div>{msg}</div>
      <button onClick={() => onDelete(index)}>Delete</button>
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

const NotificationWidgetPopoverStyled = styled(Popover)`
  right: 0;
`

const NotificationItemStyled = styled.div`

`

const NoNotificationsText = styled.p`
  text-align: center;
`


export default NotificationWidget
