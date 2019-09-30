const Router = require('express').Router
const User = require('../db/models/User')
const { signUp } = require('../validations/user')
const { parseError, sessionizeUser, sliceKeysFromObject } = require('../utils/helpers')

const userRoutes = Router()

userRoutes.post('', async (req, res) => {
  try {
    const fields = sliceKeysFromObject(req.body, signUp._ids._byKey.keys())  // TODO: NOT GOOD...
    await signUp.validateAsync(fields)

    const newUser = new User(fields)
    const newUserSaved = await newUser.save()
    const sessionUser = sessionizeUser(newUserSaved)

    req.session.user = sessionUser
    res.send(sessionUser)
  }
  catch(err) {
    res.status(400).send(parseError(err))
  }
})


module.exports = userRoutes
