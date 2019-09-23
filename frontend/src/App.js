import React, { useState } from 'react'
import LostConnectionPage from './components/LostConnectionPage'
import SocketIO  from './components/socketio/SocketIO'
import EShellPage from './components/pages/EShellPage'

import '../node_modules/xterm/dist/xterm.css'


// https://www.npmjs.com/package/mxgraph
// devicerouter.de/.com

export const MainSocketContext = React.createContext()


const mainSocket = SocketIO({ namespace: 'main' })

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
        <MainSocketContext.Provider value={mainSocket}>
          <EShellPage mainSocket={mainSocket} />
        </MainSocketContext.Provider>
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
