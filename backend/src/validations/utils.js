const Joi = require('@hapi/joi')

function normalString({ min=2, max=30, required=true, alphanum=false, pattern='' }={}) {
  const string = Joi.string().min(min).max(max)
  if (alphanum) string.alphanum()
  if (pattern.length > 0) string.pattern(pattern)
  if (required) string.required()
  return string
}

module.exports = { normalString }
