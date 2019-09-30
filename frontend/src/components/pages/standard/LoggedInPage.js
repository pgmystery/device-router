import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/macro'
import LostConnectionPage from '../LostConnectionPage'
// import EShellPage from './pages/EShellPage'

import SocketIO  from '../../../socketio/SocketIO'

import Navigation from '../../utils/Navigation'


const mapStateToProps = ({ userData }) => ({
  userData
})

export let mainSocket = null

function LoggedInPage({ children }) {
  const [mainSocketConnected, setMainSocketConnected] = useState(false)

  useEffect(() => {
    mainSocket = SocketIO({ namespace: 'user' })

    mainSocket.on('connect', () => {
      setMainSocketConnected(true)
    })
  
    mainSocket.on('disconnect', () => {
      setMainSocketConnected(false)
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

  function getPage() {
    if (mainSocketConnected) {
      return (
        <>
          <HeaderStyled>
            <Navigation links={navLinks}></Navigation>
          </HeaderStyled>
          <main>{children}</main>
          <footer></footer>
        </>
      )
    }
    return <LostConnectionPage />
  }

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
