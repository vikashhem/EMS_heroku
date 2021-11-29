const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide the full name'],
  },
  username: {
    type: String,
    required: [true, 'Please provide the username'],
    unique: [true, 'That username has already been taken'],
  },
  email: {
    type: String,
    unique: [true, 'That email is already been used'],
    required: [true, 'Please provide an email address'],
    validate: [validator.isEmail, 'Please provide an valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      //this only works only on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  designation: {
    type: String,
    required: [true, 'Please provide a designation'],
  },
  token: {
    type: String,
  },
  userPhoto: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
  },
  projects: [
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      projectName: {
        type: String,
      },
    },
  ],
});

userSchema.pre('save', async function (next) {
  //this function only run if password is modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
