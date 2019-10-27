import React, { useState, useEffect } from 'react'
import SocketIO  from './SocketIO'


export const MainSocketContext = React.createContext(null)

let mainSocketListenersQueue = []

export function MainSocketProvider({ children, session }) {
  const [mainSocketListeners, setMainSocketListeners] = useState([])
  const [authenticated, setAuthenticated] = useState(false)
  const [mainSocket, setMainSocket] = useState(null)

  useEffect(() => {
  }, [mainSocket])

  useEffect(() => {
    if (authenticated && mainSocketListeners.length) {
      mainSocketListeners.forEach(([channel, callback]) => {
        mainSocket.on(channel, (...params) => callback(...params))
      })
    }
  }, [authenticated])

  useEffect(() => {
    if (authenticated && mainSocket && mainSocketListeners.length) {
      mainSocketListeners.forEach(([channel, callback]) => {
        mainSocket.on(channel, (...params) => callback(...params))
      })

      mainSocketListenersQueue = []
    }
  }, [mainSocketListeners])

  function addMainSocketListeners(listeners) {
    mainSocketListenersQueue = [
      ...mainSocketListenersQueue,
      ...listeners
    ]

    setMainSocketListeners([
      ...mainSocketListeners,
      ...mainSocketListenersQueue,
    ])
  }

  function createMainSocket(callback, startMainSocketListeners=[]) {
    if (session.id) {
      if (mainSocket) {
        mainSocket.disconnect()
      }
      if (!mainSocket) {
        if (session.id) {
          const mainSocket = SocketIO({ namespace: 'user' })
          setMainSocket(mainSocket)

          mainSocket.on('connect', () => {
            mainSocket.emit('authenticate', {id: session.id})
  
            mainSocket.on('authenticated', () => {
              setAuthenticated(true)

              if (startMainSocketListeners.length) {
                startMainSocketListeners.forEach(([channel, callback]) => {
                  mainSocket.on(channel, (...params) => callback(...params))
                })
              }
  
              if (callback) {
                callback(mainSocket)
              }
            })
          })
  
          mainSocket.on('disconnect', () => {
            setMainSocket(null)
            setAuthenticated(false)
            callback && callback(null)
          })
        }
        else {
          mainSocket.disconnect()
          setMainSocket(null)
        }
      }
    }
    else {
      callback(new Error('No valid Session'))
    }
  }

  return (
    <MainSocketContext.Provider value={{
      mainSocket,
      createMainSocket,
      addMainSocketListener: (channel, callback) => addMainSocketListeners([[channel, callback]]),
      addMainSocketListeners,
    }}>
      {children}
    </MainSocketContext.Provider>
  )
}
