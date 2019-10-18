const mongoose = require('mongoose')

const EShellModelSchema = new mongoose.Schema({
  device: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    readOnly: true,
  },
  status: {
    type: Number,
    readOnly: true,
    default: 0,
  },
})

EShellModelSchema.virtual('user')
  .set(function(userid) {
    this.users = [userid]  // TODO: CHECK IF THE USERID EXIST AND HAS THE RIGHTS!
  })

const EShellModel = mongoose.model('EShellSession', EShellModelSchema)

module.exports = EShellModel
