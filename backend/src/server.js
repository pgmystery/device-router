const express = require('express') // Server Libary
const app = express()
const server = require('http').createServer(app)
const cors = require('cors') // Libary to allow request to the server globally
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const routes = require('./routes')
const { PORT, NODE_ENV, SESS_NAME, SESS_LIFETIME, SESS_SECRET } = require('./config')

const mongoose = require('./db/db')()

require('./sockets/SocketHandler')(server)

app.disable('x-powered-by')

app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // To accept json as request data
app.use(cors())
app.set('json spaces', 2) // to make the json response for humans readable
app.use(session({
  name: SESS_NAME,
  secret: SESS_SECRET,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'session',
    ttl: parseInt(SESS_LIFETIME) / 1000
  }),
  cookie: {
    sameSite: true,
    secure: NODE_ENV === 'production',
    maxAge: parseInt(SESS_LIFETIME),
  },
}))

routes(app)

server.listen(PORT, () => console.log(`Server ready on port ${PORT}`))
