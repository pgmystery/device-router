const express = require('express')
const User = require('../db/models/User')
const { signIn } = require('../validations/user')
const { parseError, sessionizeUser, sliceKeysFromObject } = require('../utils/helpers')
const { SESS_NAME } = require('../config')

const sessionRouter = express.Router()

sessionRouter.get('', ({ session: { user } }, res) => {
  res.send({ user })
})

sessionRouter.post('', async (req, res) => {
  try {
    const fields = sliceKeysFromObject(req.body, signIn._ids._byKey.keys())
    await signIn.validateAsync(fields)

    const user = await User.findOne({ username: fields.username })
    if (user && user.comparePasswords(fields.password)) {
      const sessionUser = sessionizeUser(user)

      req.session.user = sessionUser
      res.send(sessionUser)
    }
    else {
      throw new Error('Invalid login credentials')
    }
  }
  catch(err) {
    res.status(401).send(parseError(err))
  }
})

sessionRouter.delete('', ({ session }, res) => {
  try {
    const user = session.user
    if (user) {
      session.destroy(err => {
        if (err) throw (err)

        res.clearCookie(SESS_NAME)
        res.send(user)
      })
    }
    else {
      throw new Error('Something went wrong')
    }
  }
  catch(err) {
    res.status(422).send(parseError(err))
  }
})


module.exports = sessionRouter
