const io = require('socket.io');
const EshellSocket = require('./eshell')
const UserSocket = require('./user')

function SocketHandler(server) {
  const socket = io(server)

  const eshellSocket = new EshellSocket(socket)
  const userSocket = new UserSocket(socket, eshellSocket)

}

module.exports = SocketHandler
