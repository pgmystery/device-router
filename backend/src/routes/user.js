const Router = require('express').Router
const User = require('../db/models/User')
const { signUp } = require('../validations/user')
const { parseError, sessionizeUser, sliceKeysFromObject } = require('../utils/helpers')

const userRoutes = Router()

userRoutes.post('', async (req, res) => {
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

userRoutes.patch('', async (req, res) => {
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


module.exports = userRoutes
