import React from 'react'


export const MainSocketContext = React.createContext(null)

let mainSocket = null

export function MainSocketProvider({ children, session }) {
  return (
    <MainSocketContext.Provider value={[mainSocket, io => setMainSocket(io, session)]}>
      {children}
    </MainSocketContext.Provider>
  )
}

function setMainSocket(io, session) {
  if (!mainSocket) {
    mainSocket = io
  
    mainSocket.on('connect', () => {
      mainSocket.emit('authenticate', {id: session.id})
    })

    mainSocket.on('disconnect', () => {
      mainSocket = null
    })
  }

  return mainSocket
}
