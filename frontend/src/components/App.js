import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import GlobalStyle from './utils/GlobalStyle'
import PageHandler from './PageHandler'
import { MainSocketProvider } from '../socketio/MainSocketContext'

import '../../node_modules/xterm/css/xterm.css'


const mapStateToProps = ({ session }) => ({
  session
})

// export const backendUrl = 'http://localhost:5000/'
// export const backendUrl = '/'
export const backendUrl = ''

function App({ session }) {
  useEffect(() => {
    document.title = "Device-Router"
  }, []);

  return (
    <MainSocketProvider session={session}>
      <GlobalStyle />
      <PageHandler />
    </MainSocketProvider>
  )
}


export default connect(
  mapStateToProps
)(App)

// https://itnext.io/mastering-session-authentication-aa29096f6e22
