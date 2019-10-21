const Device = require('../db/models/Device')
const User = require('../db/models/User')

class EshellSocket {
  constructor(io, deviceSocket) {
    this.io = io
    this.eshellSessionUniqueNumber = 0
    this.sessions = []
    this.deviceSocket = deviceSocket
    this.eshellChannel = io.of('/eshell')

    this.eshellChannel.use(async (socket, next) => {
      console.log('ESHELL-MIDDLEWARE')

      if (socket.handshake.query.type === 'user') {
        await this.checkUserMiddleware(socket)
        next()
      }
      else if (socket.handshake.headers['type'] === 'device') {
        if (await this.checkDeviceMiddleware(socket)) {
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
        this.checkUserAuthentication(socket)
      }
      else if (socket.handshake.headers['type'] === 'device') {
        this.registerDeviceToSession(socket)
      }
      else {
        socket.disconnect()
      }
    })
  }

  async checkUserMiddleware(socket) {
    console.log('ESHELL-MIDDLEWARE USER')

    return true
  }

  async checkDeviceMiddleware(socket) {
    console.log('ESHELL-MIDDLEWARE DEVICE')
    const sessionId = Number(socket.handshake.headers['sessionid'])
    const deviceModel = await Device.findOne({accessToken: socket.handshake.headers['accesstoken']})
    const deviceId = deviceModel._id
    const session = this.sessions.find(session =>
      session.id === sessionId
      && session.deviceId === String(deviceId)
    )
    if (session && session.status === 0) {
      return true
    }

    return false
  }

  async checkUserAuthentication(socket) {
    socket.auth = false
    socket.on('authenticate', async data => {
      try {
        const userId = data.userId
        await User.findById(userId)

        this.createSession(socket, data)

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

  createSession(socket, data) {
    console.log('NEW ESHELL-CONNECT FROM USER')

    const eshellSession = this.addSession({
      user: socket.id,
      deviceId: data.deviceId,
      status: 0
    })

    socket.join('eshell-' + eshellSession.id)

    const deviceSocketId = Object.keys(this.deviceSocket.connectedDevices).find(key => String(this.deviceSocket.connectedDevices[key]) === String(data.deviceId))
    this.deviceSocket.deviceChannel
      .to(deviceSocketId)
      .emit('start_eshell', {id: eshellSession.id, user: socket.id})

    socket.on('disconnect', () => {
      console.log('USER ESHELL-SOCKET DISCONNECTED')

      const eshellSession = this.sessions.find(session => session.user === socket.id)

      this.eshellChannel.in('eshell-' + eshellSession.id).clients((err, clients) => {
        if (!err) {
          if (clients.length == 1) {
            this.eshellChannel.connected[clients[0]].disconnect()
          }
        }
      })
      this.removeSession(eshellSession)
    })

    socket.on('cmd', cmd => this.sendToDevice(socket, 'cmd', eshellSession.id, cmd))

    socket.on('term_size', termSize => this.sendToDevice(socket, 'term_size', eshellSession.id, termSize))
  }

  async registerDeviceToSession(socket) {
    console.log('NEW ESHELL-CONNECTION FROM A DEVICE!!!')
    const sessionId = Number(socket.handshake.headers['sessionid'])
    const accessToken = socket.handshake.headers['accesstoken']

    const deviceModel = await Device.findOne({accessToken})
    const eshellSession = this.sessions.find(session =>
      session.id === sessionId
        && session.deviceId === String(deviceModel._id)
        && session.status === 0
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

    socket.on('disconnect', () => {
      console.log('DEVICE ESHELL-SOCKET DISCONNECTED')

      const eshellSession = this.sessions.find(session => session.deviceSocket === socket.id)

      this.eshellChannel.in('eshell-' + eshellSession.id).clients((err, clients) => {
        if (!err) {
          clients.forEach(client => this.eshellChannel.connected[client].disconnect())
        }
      })
      this.removeSession(eshellSession)
    })

    socket.on('msg', msg => this.msgHandlerDevice(socket, eshellSession.id, msg))
  }

  addSession(data) {
    data.id = this.eshellSessionUniqueNumber++
    this.sessions = [...this.sessions, data]

    return data
  }

  removeSession(session) {
    if (session.id && this.sessions > 0) {
      sessionIndex = this.sessions.findIndex(itemSession = itemSession.id === session.id)
      if (sessionIndex >= 0) {
        this.sessions = [
          ...this.sessions.slice(0, sessionIndex),
          ...this.sessions.slice(sessionIndex + 1),
        ]
      }
    }
  }

  sendToDevice(socket, channel, sessionId, data) {
    const eshellSession = this.sessions.find(session =>
      session.id === sessionId
        && session.user === socket.id
    )
    socket.to(eshellSession.deviceSocket).emit(channel, data)
  }

  msgHandlerDevice(socket, sessionId, msg) {
    const eshellSession = this.sessions.find(session =>
        session.id === sessionId
        && session.deviceSocket === socket.id
    )
    socket.broadcast.to('eshell-' + eshellSession.id).emit('msg', msg)
  }
}


module.exports = EshellSocket
