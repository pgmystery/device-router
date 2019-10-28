const Router = require('express').Router
const User = require('../db/models/User')
const { signUp } = require('../validations/user')
const { parseError, sessionizeUser, sliceKeysFromObject } = require('../utils/helpers')
const RegisterToken = require('../db/models/RegisterToken')
const Device = require('../db/models/Device')

const userRouter = Router()

userRouter.post('', async (req, res) => {
  try {
    const fields = sliceKeysFromObject(req.body, signUp._ids._byKey.keys())
    await signUp.validateAsync(fields)

    const newUser = await User.create(fields)
    const sessionUser = sessionizeUser(newUser)

    req.session.user = sessionUser
    res.send(sessionUser)
  }
  catch(err) {
    res.status(400).send(parseError(err))
  }
})

userRouter.patch('', async (req, res) => {
  try {
    const userId = req.session.user.id
  
    const fields = sliceKeysFromObject(req.body, signUp._ids._byKey.keys(), true)
    Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key])
  
    const newUserData = await User.findByIdAndUpdate(userId, fields, {new: true, useFindAndModify: true})
    const sessionUser = sessionizeUser(newUserData)
  
    req.session.user = sessionUser
    res.send(sessionUser)
  }
  catch(err) {
    res.status(400).send(parseError(err))
  }
})

userRouter.get('/dashboard', async (req, res) => {
  try {
    const userId = req.session.user.id
  
    const userModel = await User.findById(userId)
    const registerTokens = await RegisterToken.find({userId})
    const devices = await Device.find({userId})
  
    res.send({registerTokens, devices, connectedToDevice: userModel.connectedToDevice})
  }
  catch(err) {
    res.status(400).send(parseError(err))
  }
})

userRouter.get('/cmds', async (req, res) => {
  try {
    const userId = req.session.user.id

    const userModel = await User.findById(userId)

    res.send({cmds: userModel.cmds})
  }
  catch(err) {
    res.status(400).send(parseError(err))
  }
})

userRouter.patch('/cmds', async (req, res) => {
  try {
    const userId = req.session.user.id

    const updatedUserModel = await User.findByIdAndUpdate(userId, { cmds: req.body.cmds })

    res.send({cmds: updatedUserModel.cmds})
  }
  catch(err) {
    res.status(400).send(parseError(err))
  }
})


module.exports = userRouter
