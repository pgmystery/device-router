const Device = require('../db/models/Device')
const User = require('../db/models/User')

class EshellSocket {
  constructor(io, deviceSocket) {
    this.eshellSessionUniqueNumber = 0
    this.sessions = []
    this.eshellChannel = io.of('/eshell')

    this.eshellChannel.use(async (socket, next) => {
      console.log('ESHELL-MIDDLEWARE')

      if (socket.handshake.query.type === 'user') {
        console.log('ESHELL-MIDDLEWARE USER')
        next()
      }
      else if (socket.handshake.headers['type'] === 'device') {
        console.log('ESHELL-MIDDLEWARE DEVICE')
        const sessionId = Number(socket.handshake.headers['sessionid'])
        const deviceModel = await Device.findOne({accessToken: socket.handshake.headers['accesstoken']})
        const deviceId = deviceModel._id
        if (this.sessions.find(session =>
          session.id === sessionId
            && session.deviceId === String(deviceId)
        ).status === 0) {
          next()
        }
      }
      else {
        socket.disconnect()
      }
    })

    this.eshellChannel.on("connection", async socket => {
      console.log('NEW ESHELL CONNECTION')
      if (socket.handshake.query.type === 'user') {
        socket.auth = false
        socket.on('authenticate', async data => {
          try {
            const userId = data.userId
            await User.findById(userId)
  
            console.log('NEW ESHELL-CONNECT FROM USER')
  
            const eshellSession = {
              id: this.eshellSessionUniqueNumber++,
              user: socket.id,
              deviceId: data.deviceId,
              status: 0
            }
  
            socket.join('eshell-' + eshellSession.id)
  
            const deviceSocketId = Object.keys(deviceSocket.connectedDevices).find(key => String(deviceSocket.connectedDevices[key]) === String(data.deviceId))
            deviceSocket.deviceChannel
              .to(deviceSocketId)
              .emit('start_eshell', {id: eshellSession.id, user: socket.id})
            this.sessions = [...this.sessions, eshellSession]
  
            socket.on('cmd', (cmd) => {
              const sessionId = cmd.sessionId
              const eshellSession = this.sessions.find(session =>
                session.id === sessionId
                  && session.user === socket.id
              )
              socket.to(eshellSession.deviceSocket).emit('cmd', cmd)
            })
  
            socket.auth = true
            socket.emit('authenticated')
          }
          catch(err) {
            console.error(err)
            console.log('Disconnecting socket ', socket.id)
            socket.disconnect()
          }
        })

        setTimeout(() => {
          if (!socket.auth) {
            console.log('Disconnecting socket ', socket.id)
            socket.disconnect('unauthorized')
          }
        }, 1000)
      }
      else if (socket.handshake.headers['type'] === 'device') {
        console.log('NEW ESHELL-CONNECTION FROM A DEVICE!!!')
        const sessionId = Number(socket.handshake.headers['sessionid'])
        const accessToken = socket.handshake.headers['accesstoken']

        const deviceModel = await Device.findOne({accessToken})
        const eshellSession = this.sessions.find(session =>
          session.id === sessionId
            && session.deviceId === String(deviceModel._id)
        )
        eshellSession.deviceSocket = socket.id
        console.log('JOIN CHANNEL', 'eshell-' + eshellSession.id)
        socket.join('eshell-' + eshellSession.id)
  
        eshellSession.status = 1
        socket.emit('eshell_session_joined', eshellSession)
  
        socket.on('rdy', sessionId => {
          console.log('rdy from device!!!s')
          const eshellSession = this.sessions.find(session =>
              session.id === sessionId
              && session.deviceSocket === socket.id
              && session.status === 1
          )
          console.log('Broadcast to channel', 'eshell-' + sessionId)
  
          socket.broadcast.to('eshell-' + eshellSession.id).emit('rdy', eshellSession)
          eshellSession.status = 2
        })
  
        socket.on('msg', (msg) => {
          const sessionId = msg.sessionId
          const eshellSession = this.sessions.find(session =>
              session.id === sessionId
              && session.deviceSocket === socket.id
          )
          console.log(msg)
          console.log('Send MSG to room')
          socket.broadcast.to('eshell-' + eshellSession.id).emit('msg', msg)
        })
      }
      else {
        console.log('NEW CONNECTION ON ESHELL')
        socket.disconnect()
      }
    })

  }
}


module.exports = EshellSocket
