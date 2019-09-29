const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// https://www.valentinog.com/blog/socket-react/
// https://facundoolano.wordpress.com/2014/10/11/better-authentication-for-socket-io-no-query-strings/
// https://socket.io/docs/migrating-from-0-9/

let connectedUsers = [];
let connectedDevices = [];
let eshellSessions = [];

let eshellSessionUniqueNumber = 0

const mainChannel = io.of("/main");
const deviceChannel = io.of("/device");
const eshellChannel = io.of("/eshell");

mainChannel.on("connection", socket => {
  //
  console.log("NEW CONNECTION!");
  // console.log(socket.handshake);  // in here should be later the express.session.id

  connectedUsers.includes(socket.id) ?
    null :
    (connectedUsers = [...connectedUsers, socket.id]);

  socket.emit('msg', 'Hallo vom Server?')

  socket.on("disconnect", () => {
    console.log(`${socket.id} -> DISCONNECTED!`)
    connectedUsers.includes(socket.id) && (connectedUsers = connectedUsers.filter(id => socket.id !== id))
    eshellSessions = eshellSessions.reduce(
        (acc, session) => session.userMainSocket === socket.id ? [...acc, eshellSessions.indexOf(session)] : acc, []
    )
    console.log(eshellSessions)
    eshellSessions.forEach(eshellSessionsIndex => {
      this.eshellSession[eshellSessionsIndex].user.disconnect()
      this.eshellSession = [
          ...this.eshellSession.slice(0, eshellSessionsIndex),
          ...this.eshellSession.slice(++eshellSessionsIndex),
      ]
    })
  })

  socket.on("start_eshell", deviceId => {
    console.log("STARTING ESHELL...");
    const device = connectedDevices.find(device => device.id === Number(deviceId))
    if (!device) return socket.emit('start_eshell', 'error')
    deviceChannel.to(device.socket).emit('start_eshell', socket.id)
  })
})

deviceChannel.on("connection", socket => {
  console.log("NEW CONNECTION!");

  socket.on("disconnect", () => {
    connectedDevices = connectedDevices.filter(
      device => device.socket !== socket.id
    )
  })

  socket.on("login", deviceId => {
    console.log("LOGIN FROM DEVICE")
    connectedDevices.every(device => device.id !== deviceId) ?
      (connectedDevices = [...connectedDevices, {
        id: deviceId,
        socket: socket.id
      }]) :
      socket.disconnect()
  })

  socket.on('join', (status, userId) => {
  //   if (status == !'accept') return mainChannel.to(userId).emit('start_eshell', false)

  })
})


eshellChannel.use((socket, next) => {
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
    console.log(eshellSessions)
    console.log(sessionId)
    console.log(userSocket)
    console.log(deviceId)
    if (eshellSessions.find(session =>
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

eshellChannel.on("connection", socket => {
  console.log('NEW ESHELL CONNECTION')
  // console.log(socket.handshake)
  if (socket.handshake.query.type === 'user') {
    console.log('NEW ESHELL-CONNECT FROM USER')
    let eshellSession = {
      id: eshellSessionUniqueNumber++,
      user: socket.id,
      userMainSocket: socket.handshake.query.userToken,
      deviceId: socket.handshake.query.deviceId,
      status: 0
    }

    socket.join('eshell-' + eshellSession.id)
    deviceChannel
      .to(connectedDevices.find(device => device.id === Number(eshellSession.deviceId)).socket)
      .emit('start_eshell', {id: eshellSession.id, user: socket.id})
    eshellSessions = [...eshellSessions, eshellSession]

    socket.on('cmd', (cmd) => {
      const sessionId = cmd.sessionId
      eshellSession = eshellSessions.find(session =>
          session.id === sessionId
          && session.user === socket.id
          // && session.deviceId === deviceId
      )
      console.log(eshellSessions)
      socket.to(eshellSession.deviceSocket).emit('cmd', cmd)
    })
  }
  else if (socket.handshake.headers['type'] === 'device') {
    console.log('NEW CONNECTION FROM A DEVICE!!!')
    const sessionId = Number(socket.handshake.headers['sessionid'])
    const userSocket = socket.handshake.headers['user']
    const deviceId = socket.handshake.headers['deviceid']
    eshellSession = eshellSessions.find(session =>
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
      eshellSession = eshellSessions.find(session =>
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
      eshellSession = eshellSessions.find(session =>
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

http.listen(3001, () => {
  console.log("listening on *:3001");
});
