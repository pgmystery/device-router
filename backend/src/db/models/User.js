const mongoose = require('mongoose')
const { compareSync, hashSync } = require('bcryptjs')
const Identicon = require('identicon.js')


const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  secondname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    validate: {
      validator: username => User.doesNotExist({ username }),
      message: 'Username already exist',
    }
  },
  email: {
    type: String,
    validate: {
      validator: email => User.doesNotExist({ email }),
      message: 'E-Mail already exist',
    }
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  devices: {
    type: Array,
    default: [],
  }
},
  {
  // toObject: { virtuals: true },
  toJSON: { virtuals: true }
}
)

userSchema.pre('save', function(next) {
  this.firstname = this.firstname.trim()
  this.secondname = this.secondname.trim()
  this.username = this.username.trim()
  this.email = this.email.trim()
  this.isEmailVerified = false
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10)
  }
  this.devices = []
  if (this.picture == undefined) {
    const hash = makeHash(this.username.hashCode().length)
    this.picture = new Identicon(hash).toString()
  }
  next();
})

userSchema.statics.doesNotExist = async function(field) {
  return await this.where(field).countDocuments() === 0
}

userSchema.methods.comparePasswords = function(password) {
  return compareSync(password, this.password)
}

userSchema.virtual('name')
  .get(function() {
    return this.firstname + ' ' + this.secondname
  })

const User = mongoose.model('User', userSchema)

function makeHash(length) {
  if (length < 15) length = 15
  let result           = ''
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

String.prototype.hashCode = function() {
  let hash = 0
  if (this.length == 0) {
      return hash.toString()
  }
  for (let i = 0; i < this.length; i++) {
      const char = this.charCodeAt(i)
      hash = ((hash<<5)-hash)+char
      hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}


module.exports = User
