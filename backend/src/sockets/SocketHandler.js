const io = require('socket.io')
const DeviceSocket = require('./device')
const EshellSocket = require('./eshell')
const UserSocket = require('./user')

function SocketHandler(server, app) {
  const socket = io(server)

  const deviceSocket = new DeviceSocket(socket)
  app.set('deviceSocket', deviceSocket)
  const eshellSocket = new EshellSocket(socket, app)
  app.set('eshellSocket', eshellSocket)
  const userSocket = new UserSocket(socket, deviceSocket, eshellSocket)
  app.set('userSocket', userSocket)

}

module.exports = SocketHandler
