const Device = require('../db/models/Device')


class DeviceSocket {
  constructor(io) {
    this.connectedDevices = {}

    this.init()

    this.deviceChannel = io.of('/device')

    this.deviceChannel.use(async (socket, next) => {
      console.log(socket.handshake.headers)
      if ('access_token' in socket.handshake.headers) {
        const deviceModel = await Device.findOne({accessToken: socket.handshake.headers['access_token']})
        if (!deviceModel.online) {
          const deviceId = deviceModel._id
          // socket.deviceId = deviceId
          this.connectedDevices[socket.id] = deviceId
          next()
        }
      }
    })

    this.deviceChannel.on('connection', async socket => {
      console.log('NEW CONNECTION FROM DEVICE')
      const deviceId = this.connectedDevices[socket.id]

      await Device.findByIdAndUpdate(deviceId, {online: true}, {useFindAndModify: false})

      socket.on('disconnect', async () => {
        await Device.findByIdAndUpdate(deviceId, {online: false}, {useFindAndModify: false})

        delete this.connectedDevices[socket.id]
      })

      // socket.on('login', deviceId => {
      //   console.log('LOGIN FROM DEVICE')

      //   this.connectedDevices.every(device => 
      //     device.id !== deviceId)
      //       ? (this.connectedDevices = [...this.connectedDevices, {
      //           id: deviceId,
      //           socket: socket.id,
      //         }])
      //       : socket.disconnect()
      // })

      // socket.on('join', (status, userId) => {
      //   //   if (status == !'accept') return mainChannel.to(userId).emit('start_eshell', false)

      // })
    })
  }

  async init() {
    await Device.updateMany({}, {online: false}, {useFindAndModify: false})
  }
}


module.exports = DeviceSocket
