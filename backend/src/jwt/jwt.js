const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const { getDaysBetweenDates } = require('../utils/helpers')


function generateToken(fields, startDay, endDay) {
  const expireDay = getDaysBetweenDates(startDay, endDay)

  if (expireDay < 0) {
    throw new Error('Invalid start- and end-dates')
  }

  return token = jwt.sign(fields, JWT_SECRET, {
    expiresIn: expireDay + 'd'
  })
}

module.exports = { generateToken }
