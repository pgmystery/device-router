const mongoose = require('mongoose')
const { MONGO_URI } = require('../config')

function dbConnect() {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  return mongoose
}

module.exports = dbConnect
