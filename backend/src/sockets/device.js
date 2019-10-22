const Device = require('../db/models/Device')
const Notification = require('../db/models/Notification')


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
          this.connectedDevices[socket.id] = deviceId
          next()
        }
      }
    })

    this.deviceChannel.on('connection', async socket => {
      console.log('NEW CONNECTION FROM DEVICE')
      const deviceId = this.connectedDevices[socket.id]

      const deviceModel = await Device.findByIdAndUpdate(deviceId, {online: true}, {useFindAndModify: false})

      Notification.create({
        userId: deviceModel.userId,
        title: `${deviceModel.name} goes Online`,
        msg: `${deviceModel.name} is now ONLINE!`,
      })

      socket.on('disconnect', async () => {
        const deviceModel = await Device.findByIdAndUpdate(deviceId, {online: false}, {useFindAndModify: false})

        if (deviceModel) {
          Notification.create({
            userId: deviceModel.userId,
            title: `${deviceModel.name} goes Offline`,
            msg: `${deviceModel.name} is now OFFLINE!`,
          })
        }

        delete this.connectedDevices[socket.id]
      })
    })
  }

  async init() {
    await Device.updateMany({}, {online: false}, {useFindAndModify: false})
  }
}


module.exports = DeviceSocket
