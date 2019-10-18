const io = require('socket.io')
const DeviceSocket = require('./device')
const EshellSocket = require('./eshell')
const UserSocket = require('./user')

function SocketHandler(server, app) {
  const socket = io(server)

  const deviceSocket = new DeviceSocket(socket)
  app.locals.deviceSocket = deviceSocket
  const eshellSocket = new EshellSocket(socket, deviceSocket)
  app.locals.eshellSocket = eshellSocket
  const userSocket = new UserSocket(socket, app)
  app.locals.userSocket = userSocket
}

module.exports = SocketHandler
