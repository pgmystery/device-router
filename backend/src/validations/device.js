const Joi = require('@hapi/joi')
const { normalString } = require('./utils')

const type = normalString()
const version = normalString()
// const description = normalString({required: false, max: 64})
const description = normalString().allow('')

const deviceValidation = Joi.object().keys({
  type,
  version,
  description,
})


module.exports = { deviceValidation }
