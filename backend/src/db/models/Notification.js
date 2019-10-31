const mongoose = require('mongoose')


const notificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
  },
  new: {
    type: Boolean,
  }
})

notificationSchema.pre('save', function(next) {
  this.new = true
  this.time = new Date()

  app.locals.userSocket.emit(this.userId, 'notification', {
    _id: this._id,
    title: this.title,
    msg: this.msg,
    time: this.time,
    new: this.new,
  })

  next()
})

const Notification = mongoose.model('Notification', notificationSchema)


module.exports = Notification
