import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
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
          <HeaderStyled>
            <Navigation
              links={navLinks}
              profileLinks={profileLinks}
            ></Navigation>
          </HeaderStyled>
          <main>{children}</main>
          <footer></footer>
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

const HeaderStyled = styled.header`
  height: 64px;
`


export default LoggedInPage
