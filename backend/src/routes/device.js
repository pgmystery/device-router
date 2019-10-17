const Router = require('express').Router
const RegisterToken = require('../db/models/RegisterToken')
const User = require('../db/models/User')
const { registerToken } = require('../validations/registerToken')
const { parseError, sliceKeysFromObject } = require('../utils/helpers')
const { generateToken } = require('../jwt/jwt')
const { deviceValidation } = require('../validations/device')
const DeviceType = require('../db/models/DeviceType')
const Device = require('../db/models/Device')


const deviceRouter = Router()

deviceRouter.get('/', async (req, res) => {
  try {
    const userId = req.session.user.id

    let devices
    if (Object.keys(req.query).includes('online')) {
      devices = await Device.find({userId, online: true})
    }
    else {
      devices = await Device.find({userId})
    }

    const devicesKeys = Device.getKeys()
  
    res.send({devices, keys: devicesKeys})
  }
  catch(err) {
    res.status(400).send(parseError('not found'))
  }
})

deviceRouter.post('/auth', async (req, res) => {
  console.log('NEW DEVICE AUTH!')
  try {
    const registerToken = await RegisterToken.findOne({token: req.body.registerToken})

    const fields = sliceKeysFromObject(req.body, deviceValidation._ids._byKey.keys())
    await deviceValidation.validateAsync(fields)

    fields.name = registerToken.name
    fields.userId = registerToken.userId
    fields.accessToken = 'null'
    fields.online = false

    const newDevice = new Device(fields)
    const newDeviceSaved = await newDevice.save()

    await RegisterToken.findOneAndDelete({token: req.body.registerToken})

    res.send(newDeviceSaved)
  }
  catch(err) {
    res.status(400).send('Invalid request')
  }
})

deviceRouter.get('/register', async (req, res) => {
  try {
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
  }
  catch(err) {
    res.status(400).send(parseError('invalid request'))
  }
})

deviceRouter.post('/register', async (req, res) => {
  try {
    const userId = req.session.user.id

    await User.findById(userId)

    const fields = sliceKeysFromObject(req.body, registerToken._ids._byKey.keys())
    await registerToken.validateAsync(fields)

    fields.userId = userId

    fields.token = generateToken({
      name: fields.name,
      username: fields.username,
      email: fields.email,
      _id: fields._id,
    }, fields.startDate, fields.endDate)

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
      fields.token = generateToken({
        name: registerTokenModel.name,
        username: registerTokenModel.username,
        email: registerTokenModel.email,
        _id: registerTokenModel._id,
      }, startDate, endDate)
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


module.exports = deviceRouter
