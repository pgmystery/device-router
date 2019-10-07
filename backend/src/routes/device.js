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
  const registerTokensOriginal = await RegisterToken.find({userId})

  const registerTokens = registerTokensOriginal.map(tokenObject => {
    return {
      ...tokenObject._doc,
      startDate: tokenObject.startDate.getDate()
        + '.'
        + (tokenObject.startDate.getMonth() + 1)
        + '.'
        + tokenObject.startDate.getFullYear(),
      endDate: tokenObject.endDate.getDate()
        + '.'
        + (tokenObject.endDate.getMonth() + 1)
        + '.'
        + tokenObject.endDate.getFullYear(),
    }
  })

  const registerTokensKeys = RegisterToken.getKeys()

  res.send({ tokens: registerTokens, keys: registerTokensKeys })
})

deviceRouter.get('/register/:id', async (req, res) => {
  const userId = req.session.user.id
  const registerToken = await RegisterToken.findById(req.params.id)

  registerToken.startDate = registerToken.startDate.getDate()
    + '.'
    + (registerToken.startDate.getMonth() + 1)
    + '.'
    + registerToken.startDate.getFullYear()
  registerToken.endDate = registerToken.endDate.getDate()
    + '.'
    + (registerToken.endDate.getMonth() + 1)
    + '.'
    + registerToken.endDate.getFullYear()

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

deviceRouter.patch('/register/:id', async (req, res) => {
  try {
    const userId = req.session.user.id

    await User.findById(userId)

    let fields = sliceKeysFromObject(req.body, registerToken._ids._byKey.keys())
    fields = Object.keys(fields)
      .reduce((pre, curr) => {
        if (fields[curr]) {
          return {...pre, [curr]: fields[curr]}
        }
        return pre
      }, {})
    await registerToken.validateAsync(fields)

    const registerTokenModel = await RegisterToken.findOne({_id: req.params.id, userId})

    if (Object.keys(req.body).includes('token')) {
      const startDate = registerTokenModel.startDate.getFullYear() + '-' + (registerTokenModel.startDate.getMonth() + 1) + '-' + registerTokenModel.startDate.getDate()
      const endDate = registerTokenModel.endDate.getFullYear() + '-' + (registerTokenModel.endDate.getMonth() + 1) + '-' + registerTokenModel.endDate.getDate()
      fields.token = generateToken(registerTokenModel, startDate, endDate)
    }

    const newRegisterTokenModel = await RegisterToken.findOneAndUpdate({_id: req.params.id, userId}, fields, {useFindAndModify: false})

    res.send(newRegisterTokenModel)
  }
  catch(err) {
    res.status(400).send(parseError('invalid request'))
  }
})

deviceRouter.delete('/register/:id', async (req, res) => {
  try {
    const userId = req.session.user.id

    await User.findById(userId)

    const deletedRegisterTokenModel = await RegisterToken.findOneAndDelete({_id: req.params.id, userId})

    res.send(deletedRegisterTokenModel)
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
