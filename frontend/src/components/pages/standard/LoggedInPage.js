import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import LostConnectionPage from '../LostConnectionPage'
// import EShellPage from './pages/EShellPage'

import SocketIO  from '../../../socketio/SocketIO'

import Navigation from '../../utils/navigation/Navigation'
import { DropdownMenuSeparator } from '../../utils/DropdownMenu'


const mapStateToProps = ({ session }) => ({
  session
})

export let mainSocket = null

function LoggedInPage({ children, session }) {
  const [mainSocketConnected, setMainSocketConnected] = useState(false)
  const { setMainSocket } = useContext(MainSocketContext)

  useEffect(() => {
    mainSocket = SocketIO({ namespace: 'user' })

    mainSocket.on('connect', () => {
      mainSocket.emit('authenticate', {id: session.id})

      mainSocket.on('authenticated', () => {
        setMainSocketConnected(true)
      })
    })
  
    mainSocket.on('disconnect', () => {
      setMainSocketConnected(false)
    })

    mainSocket.on('msg', msg => {
      console.log(msg)
    })
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

<<<<<<< HEAD
  function getMainSocket(mainSocket) {
    if (mainSocket) {
      setMainSocketConnected(true)

      mainSocket.on('disconnect', () => {
        setMainSocketConnected(false)
      })
    }
  }

=======
>>>>>>> master
  return (
    getPage()
  )
}

const HeaderStyled = styled.header`
  height: 64px;
`


export default connect(
  mapStateToProps
)(LoggedInPage)
