import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import LostConnectionPage from '../LostConnectionPage'
import Navigation from '../../utils/navigation/Navigation'
import { DropdownMenuSeparator } from '../../utils/DropdownMenu'
import { MainSocketContext,  } from '../../../socketio/MainSocketContext'
import useMainSocket from '../../../utils/hooks/useMainSocket'


function LoggedInPage({ children }) {
  const [notifications, setNotifications] = useState([])
  const [mainSocketConnected, setMainSocketConnected] = useState(false)
  const { createMainSocket, mainSocket } = useContext(MainSocketContext)
  const [newNotification] = useMainSocket('notification')
  const [newNotifications] = useMainSocket('notifications')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  useEffect(() => {
    createMainSocket(getMainSocket)
  }, [])

  useEffect(() => {
    newNotification && addNotifications([newNotification])
  }, [newNotification])

  useEffect(() => {
    newNotifications && addNotifications(newNotifications)
  }, [newNotifications])

  const navLinks = [
    {
      name: 'Dashboard',
      url: '/dashboard',
    },
    {
      name: 'Registerlist',
      url: '/registerlist',
    },
    {
      name: 'Devices',
      url: '/devices',
    },
    {
      name: 'EShell',
      url: '/eshell',
    },
  ]

  const profileLinks = [
    <Link to='/profile'>My Profile</Link>,
    <Link to='/dashboard'>My Dashboard</Link>,
    <DropdownMenuSeparator />,
    <Link style={{color: 'red'}} to='/logout'>Logout</Link>
  ]

  function getPage() {
    if (mainSocketConnected) {
      return (
        <>
          <header>
            <Navigation
              links={navLinks}
              profileLinks={profileLinks}
              notifications={notifications}
              onNotificationClicked={onNotificationClicked}
              onNotificationsDeleted={removeNotification}
            ></Navigation>
          </header>
          <main>{children}</main>
        </>
      )
    }
    return <LostConnectionPage />
  }

  function getMainSocket(mainSocket) {
    if (mainSocket) {
      setMainSocketConnected(true)

      mainSocket.on('disconnect', () => {
        setMainSocketConnected(false)
      })
    }
  }

  function addNotifications(newNotifications) {
    setNotifications([
      ...newNotifications,
      ...notifications,
    ])

    if (isNotificationOpen) {
      mainSocket.emit('notificationsReaded')
    }
  }

  function onNotificationClicked(isOpen) {
    setIsNotificationOpen(isOpen)
    mainSocket.emit('notificationsReaded')
  }

  function removeNotification(index) {
    const notification = notifications[index]

    mainSocket.emit('notificationDelete', notification._id)

    setNotifications([
      ...notifications.slice(0, index),
      ...notifications.slice(index + 1),
    ])
  }

  return (
    getPage()
  )
}


export default LoggedInPage
