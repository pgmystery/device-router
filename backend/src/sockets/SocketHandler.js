const io = require('socket.io')
const DeviceSocket = require('./device')
const EshellSocket = require('./eshell')
const UserSocket = require('./user')

function SocketHandler(server) {
  const socket = io(server)

  const deviceSocket = new DeviceSocket(socket)
  const eshellSocket = new EshellSocket(socket)
  const userSocket = new UserSocket(socket, deviceSocket, eshellSocket)

}

module.exports = SocketHandler
