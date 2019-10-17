import React, { useState } from 'react'


export const MainSocketContext = React.createContext(null)

export function MainSocketProvider({ children, session }) {
  const [mainSocket, setMainSocket] = useState()

  return (
    <MainSocketContext.Provider value={[mainSocket, setMainSocket]}>
      {children}
    </MainSocketContext.Provider>
  )
}

// function MainSocket(session) {
//   return {
//     mainSocket: null,
//     isConnected: false,

//     createConnection: () => {
//       if (!isConnected) {
//         mainSocket
//       }
//     }
//   }

//   const mainSocket = null
//   const isConnected = false
//   function createConnection() {
//     if (!isConnected) {
//       mainSocket = SocketIO({ namespace: 'user' })
//     }
//     return mainSocket
//   }

//   function closeConnection() {
//     if (isConnected) {
//       mainSocket.disconnect()
//     }
//   }

//   // mainSocket.on('connect', () => {
//   //   mainSocket.emit('authenticate', {id: session.id})
//   // })

//   // return mainSocket
// }
