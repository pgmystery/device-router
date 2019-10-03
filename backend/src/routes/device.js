const Router = require('express').Router
const RegisterToken = require('../db/models/RegisterToken')
const User = require('../db/models/User')
const { registerToken } = require('../validations/registerToken')
const { parseError, sliceKeysFromObject } = require('../utils/helpers')
const { generateToken } = require('../jwt/jwt')
const DeviceType = require('../db/models/DeviceType')


const deviceRouter = Router()
deviceRouter.get('/register', async (req, res) => {
  const userId = req.session.user.id
  const registerTokens = await RegisterToken.find({userId})

  const registerTokensKeys = RegisterToken.getKeys()

  res.send({ tokens: registerTokens, keys: registerTokensKeys })
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

deviceRouter.get('/type', async (req, res) => {
  const deviceTypes = await DeviceType.find({}, {_id: 0, __v: 0})

  res.send(deviceTypes)
})

// deviceRouter.post('/type', async (req, res) => {
//   const newDeviceTypes = new DeviceType(req.body)
//   newDeviceTypesSaved = await newDeviceTypes.save()

//   console.log(newDeviceTypesSaved)

//   res.send(newDeviceTypesSaved)
// })


module.exports = deviceRouter