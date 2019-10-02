const Router = require('express').Router
const RegisterToken = require('../db/models/RegisterToken')
const User = require('../db/models/User')
const { registerToken } = require('../validations/registerToken')
const { parseError, sliceKeysFromObject } = require('../utils/helpers')
const { generateToken } = require('../jwt/jwt')


const deviceRouter = Router()
deviceRouter.get('/register', async (req, res) => {
  const userId = req.session.user.id
  const registerTokens = await RegisterToken.find({userId})

  res.send({ registerTokens })
})

deviceRouter.get('/register/:id', async (req, res) => {
  const userId = req.session.user.id
  const registerToken = await RegisterToken.findById(req.params.id)

  res.send({ registerToken })
})

deviceRouter.post('/register', async (req, res) => {
  try {
    const userId = req.session.user.id

    await User.findById(userId)

    const fields = sliceKeysFromObject(req.body, registerToken._ids._byKey.keys())
    await registerToken.validateAsync(fields)

    fields.userId = userId
    fields.token = generateToken(fields, fields.startDate, fields.endDate)

    const newRegisterToken = new RegisterToken(fields)
    const newRegisterTokenSaved = await newRegisterToken.save()

    res.send(newRegisterTokenSaved)
  }
  catch(err) {
    res.status(400).send(parseError('invalid request'))
  }
})


module.exports = deviceRouter
