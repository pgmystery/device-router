const User = require('../db/models/User')

class UserSocket {
  constructor(io, deviceSocket, eshellSocket) {
    this.connectedUsers = {}
    this.userChannel = io.of('/user')

    this.userChannel.on('connection', socket => {
      console.log('NEW CONNECTION!')
      socket.auth = false
      socket.on('authenticate', data => {
        checkUserId(data.id)
          .then(userId => {
            console.log('Authenticated socket ', socket.id)
            socket.auth = true
            if (Object.keys(this.connectedUsers).includes(socket.id)) {
              socket.disconnect()
            }
            else {
            }
            this.connectedUsers = {...this.connectedUsers, [socket.id]: userId}
            socket.emit('authenticated')
          })
          .catch(err => {
            console.log('Disconnecting socket ', socket.id);
            socket.disconnect(err)
          })
      })

      setTimeout(() => {
        if (!socket.auth) {
          console.log('Disconnecting socket ', socket.id)
          socket.disconnect('unauthorized')
        }
      }, 1000)

      socket.on('disconnect', () => {
        console.log(`${socket.id} -> DISCONNECTED!`)

        delete this.connectedUsers[socket.id]

        // eshellSessions = eshellSessions.reduce(
        //   (acc, session) => {
        //     return session.userMainSocket === socket.id ? acc : [...acc, eshellSessions.indexOf(session)]
        //   }, []
        // )
        console.log(eshellSocket.sessions)
        // TODO:
        // eshellSocket.sessions = eshellSocket.sessions.map(session => {
        //   const returnValue = session.userMainSocket !== socket.id
        //   returnValue && (session.user)
        //   return returnValue
        // })


      })

      socket.on('start_eshell', deviceId => {
        console.log('STARTING ESHELL...')

        if (socket.auth) {
          const device = deviceSocket.connectedDevices.find(device => device.id === Number(deviceId))
          if (!device) return socket.emit('start_eshell', socket.id)
          deviceSocket.deviceChannel.to(device.socket).emit('start_eshell', socket.id)
        }
      })
    })
  }
}

async function checkUserId(userId) {
  try {
    await User.findById(userId)
  
    return userId
  }
  catch(err) {
    throw new Error('unauthorized')
  }
}


module.exports = UserSocket
