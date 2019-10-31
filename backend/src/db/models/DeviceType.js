const mongoose = require('mongoose')


const deviceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    validate: {
      validator: name => DeviceType.doesNotExist({ name }),
      message: 'the device already exist',
    },
  },
  version: {
    type: Object,
    require: true,
  },
})

deviceTypeSchema.statics.doesNotExist = async function(field) {
  return await this.where(field).countDocuments() === 0
}

const DeviceType = mongoose.model('DeviceTypes', deviceTypeSchema)


module.exports = DeviceType
