const jwt = require('jsonwebtoken')

const JWT_SECRET = 'secret'

function generateToken(user) {
  const u = {
    name: user.name,
    username: user.username,
    email: user.email,
    // admin: user.admin,
    _id: user._id,
  }

  // console.log(process.env.JWT_SECRET)
  return token = jwt.sign(u, JWT_SECRET, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  })
}

modul.export = generateToken
S