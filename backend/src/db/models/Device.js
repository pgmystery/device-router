const mongoose = require('mongoose')

const deviceSchema = mongoose.Schema({
  accessKey: {
    type: 'ObjectId'
  }
})
