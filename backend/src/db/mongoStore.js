const MongoStore = require('connect-mongo')
const mongoose = require('./db')()
const { SESS_LIFETIME } = require('../config')


function mongoStore(session) {
  const MongoStoreSession = MongoStore(session)

  return new MongoStoreSession({
    mongooseConnection: mongoose.connection,
    collection: 'session',
    autoRemove: 'disabled',
    // autoRemoveInterval: 1
    // ttl: parseInt(SESS_LIFETIME) / 1000
  })
}


module.exports = mongoStore
