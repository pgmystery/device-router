import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import LostConnectionPage from '../LostConnectionPage'
import Navigation from '../../utils/navigation/Navigation'
import { DropdownMenuSeparator } from '../../utils/DropdownMenu'
import SocketIO  from '../../../socketio/SocketIO'
import { MainSocketContext } from '../../../socketio/MainSocketContext'


function LoggedInPage({ children }) {
  const [mainSocketConnected, setMainSocketConnected] = useState(false)
  const setMainSocket = useContext(MainSocketContext)[1]

  useEffect(() => {
    setMainSocket(SocketIO({ namespace: 'user' }), getMainSocket)
  }, [])

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
  
      mainSocket.on('msg', msg => {
        console.log(msg)
      })
    }
  }

  return (
    getPage()
  )
}


export default LoggedInPage
