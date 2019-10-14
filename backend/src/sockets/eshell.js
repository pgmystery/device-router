const EShell = require('../eshell/Eshell')
const Device = require('../db/models/Device')

// HOW IT WORKS:
// user -> on_connect ->

class EshellSocket {
  constructor(io) {
    this.eshellSessionUniqueNumber = 0
    this.eshell = new EShell()
    console.log(this.eshell)
    this.sessions = []
    this.eshellChannel = io.of('/eshell')

    this.eshellChannel.use((socket, next) => {
      console.log('ESHELL-MIDDLEWARE')
      console.log(socket.handshake.query)
  
      if (socket.handshake.query.type === 'user') {
        console.log('ESHELL-MIDDLEWARE USER')
        next()
      }
      else if (socket.handshake.headers['type'] === 'device') {
        console.log('ESHELL-MIDDLEWARE DEVICE')
        console.log(socket.handshake.headers)
        const sessionId = Number(socket.handshake.headers['sessionid'])
        const userSocket = socket.handshake.headers['user']
        const deviceId = socket.handshake.headers['deviceid']
        console.log(sessions)
        console.log(sessionId)
        console.log(userSocket)
        console.log(deviceId)
        if (sessions.find(session =>
            session.id === sessionId
            && session.user === userSocket
            && session.deviceId === deviceId
        ).status === 0) {
          next()
        }
      }
      else {
        socket.disconnect()
      }
    })
  
    this.eshellChannel.on("connection", socket => {
      console.log('NEW ESHELL CONNECTION')
      // console.log(socket.handshake)
      if (socket.handshake.query.type === 'user') {
        console.log('NEW ESHELL-CONNECT FROM USER')
        console.log(this.eshell)
        this.eshell.createSession()
        // TODO: AUTH!!! CHECK IF USER HAS RIGHT TO CONNECT TO THE DEVICE
        const eshellSession = {
          id: this.eshellSessionUniqueNumber++,
          user: socket.id,
          userMainSocket: socket.handshake.query.userToken,
          deviceId: socket.handshake.query.deviceId,
          status: 0
        }

        socket.join('eshell-' + eshellSession.id)
        this.deviceChannel  // TODO: -> define deviceChannel
          .to(connectedDevices.find(device => device.id === Number(eshellSession.deviceId)).socket)
          .emit('start_eshell', {id: eshellSession.id, user: socket.id})
        this.sessions = [...sessions, eshellSession]
  
        socket.on('cmd', (cmd) => {
          const sessionId = cmd.sessionId
          this.sessions = sessions.find(session =>
              session.id === sessionId
              && session.user === socket.id
              // && session.deviceId === deviceId
          )
          console.log(sessions)
          socket.to(eshellSession.deviceSocket).emit('cmd', cmd)
        })
      }
      else if (socket.handshake.headers['type'] === 'device') {
        console.log('NEW CONNECTION FROM A DEVICE!!!')
        const sessionId = Number(socket.handshake.headers['sessionid'])
        const userSocket = socket.handshake.headers['user']
        const deviceId = socket.handshake.headers['deviceid']
        this.sessions = sessions.find(session =>
            session.id === sessionId
            && session.user === userSocket
            && session.deviceId === deviceId
        )
        eshellSession.deviceSocket = socket.id
        console.log('JOIN CHANNEL', 'eshell-' + eshellSession.id)
        socket.join('eshell-' + eshellSession.id)
  
        eshellSession.status = 1
        socket.emit('eshell_session_joined', eshellSession)
  
        socket.on('rdy', sessionId => {
          console.log('rdy from device!!!s')
          this.sessions = sessions.find(session =>
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
          this.sessions = sessions.find(session =>
              session.id === sessionId
              && session.deviceSocket === socket.id
              // && session.deviceId === deviceId
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
