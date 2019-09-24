import React, { useState } from 'react'
import LostConnectionPage from './LostConnectionPage'
import SocketIO  from './socketio/SocketIO'
import EShellPage from './pages/EShellPage'

import '../../node_modules/xterm/dist/xterm.css'


// https://www.npmjs.com/package/mxgraph
// devicerouter.de/.com


export const backendUrl = 'http://127.0.0.1:3001'

export const mainSocket = SocketIO({ namespace: 'main' })

function App() {
  const [mainSocketConnected, setMainSocketConnected] = useState(false)

  mainSocket.on('connect', () => {
    setMainSocketConnected(true)
  })

  mainSocket.on('disconnect', () => {
    setMainSocketConnected(false)
  })

  function getPage() {
    if (mainSocketConnected) {
      return (
        <EShellPage mainSocket />
      )
    }
    return <LostConnectionPage />
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Welcome to Device-Router</h1>
      </header>
      {getPage()}
    </div>
  )
}


export default App
