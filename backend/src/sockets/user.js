const User = require('../db/models/User')
const 

class UserSocket {
  constructor(io) {
    this.connectedUsers = {}
    this.userChannel = io.of('/user')
    this.socket = null
    this.deviceSocket = app.locals.deviceSocket

    this.userChannel.on('connection', socket => this.socket = socket)

    this.userChannel.on('connection', socket => {
      console.log('NEW CONNECTION!')
      socket.auth = false
      socket.on('authenticate', async data => {
        try {
          const userId = data.id
          await User.findById(userId)
          console.log('Authenticated socket ', socket.id)
          socket.auth = true
          if (Object.keys(this.connectedUsers).includes(socket.id)) {
            socket.disconnect()
          }
          else {
          }
          this.connectedUsers = {...this.connectedUsers, [socket.id]: userId}
          socket.emit('authenticated')
        }
        catch(err) {
          console.log('Disconnecting socket ', socket.id);
          socket.disconnect(err)
        }
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
      })

      socket.on('start_eshell', deviceId => {
        console.log('STARTING ESHELL...')

        if (socket.auth) {
          const device = this.deviceSocket.connectedDevices.find(device => device.id === Number(deviceId))
          if (!device) return socket.emit('start_eshell', socket.id)
          this.deviceSocket.deviceChannel.to(device.socket).emit('start_eshell', socket.id)
        }
      })
    })
  }

  send(channel, msg='') {
    if (socket) {
      socket.emit(channel, msg)
    }
  }

  receive() {

  }
}


module.exports = UserSocket
