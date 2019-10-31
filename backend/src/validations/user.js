const Joi = require('@hapi/joi')
const { normalString } = require('./utils')

const firstname = normalString()
const secondname = normalString()
const email = Joi.string().email().required()
const username = normalString({ alphanum: true })
const password = normalString({ min: 6, pattern: /^[a-zA-Z0-9]$/ })

const signUp = Joi.object().keys({
  firstname,
  secondname,
  username,
  email,
  password
})

const signIn = Joi.object().keys({
  username,
  password
})


module.exports = { signUp, signIn }
