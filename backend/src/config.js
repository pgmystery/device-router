const {
  PORT = 5000,
  NODE_ENV = 'development',

  // If you run it local:
  // MONGO_URI = 'mongodb://localhost:27017/devicerouter',
  // If you run it in a docker-container:
  MONGO_URI = 'mongodb://mongo:27017/devicerouter',

  SESS_NAME = 'sid',
  SESS_SECRET = 'mySecret!',
  SESS_LIFETIME = 1000 * 60 * 60 * 2,

  JWT_SECRET = 'secret'

} = process.env

module.exports = {
  PORT,
  NODE_ENV,
  MONGO_URI,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  JWT_SECRET,
}
