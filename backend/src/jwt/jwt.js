const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const { getDaysBetweenDates } = require('../utils/helpers')


function generateToken(user, startDay, endDay) {
  const u = {
    name: user.name,
    username: user.username,
    email: user.email,
    _id: user._id,
  }

  const expireDay = getDaysBetweenDates(startDay, endDay)

  if (expireDay < 0) {
    throw new Error('Invalid start- and end-dates')
  }

  return token = jwt.sign(u, JWT_SECRET, {
    //  expiresIn: 60 * 60 * 24 // expires in 24 hours
    expiresIn: expireDay + 'd'
  })
}

module.exports = { generateToken }
