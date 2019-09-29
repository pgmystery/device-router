const mongoose = require('mongoose')
const { compareSync, hashSync } = require('bcryptjs')


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


module.exports = User
