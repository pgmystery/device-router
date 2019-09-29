import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../../actions/session'
// import EShellPage from './pages/EShellPage'
import LostConnectionPage from './LostConnectionPage'

import SocketIO  from '../../socketio/SocketIO'

export let mainSocket = null

const mapStateToProps = ({ session }) => ({
  session
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

function Dashboard({ logout, session }) {
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

  function getPage() {
    if (mainSocketConnected) {
      return <p>You are now logged in!</p>
    }
    return <LostConnectionPage />
  }

  return (
    <>
      <h1>Hi {session.username}</h1>
      { getPage() }
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
