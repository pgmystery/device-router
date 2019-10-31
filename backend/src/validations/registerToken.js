const Joi = require('@hapi/joi')
const { normalString } = require('./utils')

const name = normalString()
const startDate = Joi.date()
const endDate = Joi.date()

const registerToken = Joi.object().keys({
  name,
  startDate,
  endDate,
})


module.exports = { registerToken }
