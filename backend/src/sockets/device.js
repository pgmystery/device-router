class DeviceSocket {
  constructor(io) {
    this.connectedDevices = []
    this.deviceChannel = io.of('/device')

    this.deviceChannel.on('connection', socket => {
      console.log('NEW CONNECTION FROM DEVICE')

      socket.on('disconnect', () => {
        this.connectedDevices = this.connectedDevices.filter(
          device => device.socket !== socket.id
        )
      })

      socket.on('login', deviceId => {
        console.log('LOGIN FROM DEVICE')

        this.connectedDevices.every(device => 
          device.id !== deviceId)
            ? (this.connectedDevices = [...this.connectedDevices, {
                id: deviceId,
                socket: socket.id,
              }])
            : socket.disconnect()
      })

      socket.on('join', (status, userId) => {
        //   if (status == !'accept') return mainChannel.to(userId).emit('start_eshell', false)

      })
    })
  }
}


module.exports = DeviceSocket
