import React, { useState, useEffect, useLayoutEffect } from 'react'


export const MainSocketContext = React.createContext(null)

export function MainSocketProvider({ children, session, startMainSocketListeners=[] }) {
  const [mainSocketListeners, setMainSocketListeners] = useState(startMainSocketListeners)
  const [mainSocketListenersQuery, setMainSocketListenersQuery] = useState([])
  const [authenticated, setAuthenticated] = useState(false)
  const [mainSocket, setMainSocketState] = useState(null)
  const [mainSocketCallback, setMainSocketCallback] = useState(null)

  useEffect(() => {
    if (mainSocketCallback) {
      const [mainSocket, callback] = mainSocketCallback

      if (mainSocket) {
        if (session.id) {
          mainSocket.on('connect', () => {
            mainSocket.emit('authenticate', {id: session.id})

            mainSocket.on('authenticated', () => {
              setMainSocketState(mainSocket)
              setAuthenticated(true)

              if (callback) {
                console.log('callback', callback)
                callback(mainSocket)
              }
            })
          })

          mainSocket.on('disconnect', () => {
            setMainSocketState(null)
            setAuthenticated(false)
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

  useEffect(() => {
    if (authenticated && mainSocketListeners.length > 0) {
      mainSocketListeners.forEach(([channel, callback]) => {
        mainSocket.on(channel, (...params) => callback(...params))
      })
    }
  }, [authenticated])

  useEffect(() => {
    if (authenticated && mainSocketListenersQuery.length > 0) {
      mainSocketListenersQuery.forEach(([channel, callback]) => {
        mainSocket.on(channel, (...params) => callback(...params))
      })

      setMainSocketListenersQuery([])
    }

  }, [mainSocketListenersQuery])

  function addMainSocketListeners(listeners) {
    setMainSocketListeners([
      ...mainSocketListeners,
      ...listeners,
    ])

    setMainSocketListenersQuery(listeners)
  }

  return (
    <MainSocketContext.Provider value={{
      mainSocket,
      setMainSocket: (io, callback) => setMainSocket(io, session, callback, [mainSocketCallback, setMainSocketCallback]),
      addMainSocketListener: (channel, callback) => addMainSocketListeners([[channel, callback]]),
      addMainSocketListeners,
    }}>
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
