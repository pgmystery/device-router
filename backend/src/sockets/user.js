const User = require('../db/models/User')
const Notification = require('../db/models/Notification')


class UserSocket {
  constructor(io) {
    this.io = io
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

          const notifications = await Notification.find({userId}, {__v: 0, userId: 0})
          if (notifications.length > 0) {
            socket.emit('notifications', notifications)
          }

          socket.on('notificationsReaded', async () => {
            await Notification.updateMany({userId, new: true}, {new: false}, {useFindAndModify: false})
          })

          socket.on('notificationDelete', async notificationId => {
            await Notification.findOneAndDelete({_id: notificationId, userId})
          })
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

  emit(userId, channel, msg={}) {
    const userSocketId = Object.keys(this.connectedUsers).find(key => String(this.connectedUsers[key]) === String(userId))
    if (this.userChannel.connected[userSocketId]) {
      this.userChannel
        .to(userSocketId)
        .emit(channel, msg)

      return true
    }
    else {
      return false
    }
  }
}


module.exports = UserSocket
