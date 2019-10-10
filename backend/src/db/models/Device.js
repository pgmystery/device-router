const mongoose = require('mongoose')
const { generateToken } = require('../../jwt/jwt')


const deviceSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
    validate: {
      validator: accessToken => Device.doesNotExist({ accessToken }),
      message: 'AccessToken already exist',
    }
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
})

deviceSchema.pre('save', function(next) {
  this.accessToken = generateToken({
    name: this.name,
    type: this.type,
    version: this.version,
  }, '2010-1-1', '2020-1-1')

  next()
})

deviceSchema.statics.doesNotExist = async function(field) {
  return await this.where(field).countDocuments() === 0
}

const Device = mongoose.model('Device', deviceSchema)

module.exports = Device
