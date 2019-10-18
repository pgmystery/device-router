import React, { useState, useEffect } from 'react'


export const MainSocketContext = React.createContext(null)

export function MainSocketProvider({ children, session }) {
  const [mainSocketCallback, setMainSocketCallback] = useState(null)
  const [mainSocket, setMainSocketState] = useState(null)

  useEffect(() => {
    if (mainSocketCallback) {
      const [mainSocket, callback] = mainSocketCallback

      if (mainSocket) {
        if (session.id) {
          mainSocket.on('connect', () => {
            mainSocket.emit('authenticate', {id: session.id})

            mainSocket.on('authenticated', () => {
              setMainSocketState(mainSocket)
              if (callback) {
                callback(mainSocket)
              }
            })
          })

          mainSocket.on('disconnect', () => {
            setMainSocketState(null)
            callback && callback(null)
          })
        }
        else {
          mainSocket.disconnect()
          setMainSocketState(null)
        }
      }
    }
  }, [mainSocketCallback])

  return (
    <MainSocketContext.Provider value={[mainSocket, (io, callback) => setMainSocket(io, session, callback, [mainSocketCallback, setMainSocketCallback])]}>
      {children}
    </MainSocketContext.Provider>
  )
}

function setMainSocket(io, session, callback, mainSocketCallbackState) {
  const [mainSocketCallback, setMainSocketCallback] = mainSocketCallbackState

  if (session.id) {
    setMainSocketCallback([io, callback])
  }
  else {
    mainSocketCallback.disconnect()
    setMainSocketCallback(null)
    callback(new Error('No valid Session'))
  }
  
}
