class UserSocket {
  constructor(io, deviceSocket, eshellSocket) {
    this.connectedUsers = []
    this.userChannel = io.of('/user')

    this.userChannel.on('connection', socket => {
      console.log('NEW CONNECTION!')

      this.connectedUsers.includes(socket.id) || (this.connectedUsers = [...this.connectedUsers, socket.id])

      socket.emit('msg', 'Hallo vom Server!')  // TODO: REMOVE THIS LINE!

      socket.on('disconnect', () => {
        console.log(`${socket.id} -> DISCONNECTED!`)

        const socketIndex = this.connectedUsers.indexOf(socket.id)
        this.connectedUsers = [
          ...this.connectedUsers.slice(0, socketIndex),
          ...this.connectedUsers.slice(socketIndex + 1)
        ]

        // eshellSessions = eshellSessions.reduce(
        //   (acc, session) => {
        //     return session.userMainSocket === socket.id ? acc : [...acc, eshellSessions.indexOf(session)]
        //   }, []
        // )
        console.log(eshellSocket.sessions)
        eshellSocket.sessions = eshellSocket.sessions.map(session => {
          const returnValue = session.userMainSocket !== socket.id
          returnValue && (session.user)
          return returnValue
        })


      })

      socket.on('start_eshell', deviceId => {
        console.log('STARTING ESHELL...')

        const device = deviceSocket.connectedDevices.find(device => device.id === Number(deviceId))
        if (!device) return socket.emit('start_eshell', socket.id)
        deviceSocket.deviceChannel.to(device.socket).emit('start_eshell', socket.id)
      })
    })
  }
}

module.exports = UserSocket
