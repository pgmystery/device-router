const mongoose = require('mongoose')


const registerTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startDate: {
    // https://mongoosejs.com/docs/schematypes.html#dates
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  // MAC-Adress ?
})

registerTokenSchema.statics.getKeys = function() {
  return {
    'name': 'Name',
    'token': 'Token',
    'startDate': 'Start Date',
    'endDate': 'End Date',
  }
}

const RegisterToken = mongoose.model('RegisterToken', registerTokenSchema)


module.exports = RegisterToken
