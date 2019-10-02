const Router = require('express').Router

function routes(app) {
  const apiRouter = Router()
  app.use('/api', apiRouter)

  apiRouter.use('/users', require('./routes/user'))
  apiRouter.use('/session', require('./routes/session'))
  apiRouter.use('/device', require('./routes/device'))
}

module.exports = routes
