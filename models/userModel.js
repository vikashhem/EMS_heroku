const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// const joi = require('joi');
// const Joi = require('joi');
// const joigoose = require('joigoose')(mongoose, null, {
//   _id: false,
//   //   timestamps: false,
// });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, " Please provide a name"],
  },
  username: {
    type: String,
    // unique: true,
    required: [true, "Please provide an username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email address"],
    validate: [validator.isEmail, "Please provide an valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      //this only works only on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not the same",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  activation_token: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter the phoneNumber"],
  },
  companyName: {
    type: String,
    required: [true, "Please enter the company name"],
  },
  companyDescription: {
    type: String,
    required: [true, "Please specify the company description"],
  },
  companyNumber: {
    type: Number,
    required: [true, "Please enter the company number"],
  },
  companyEmail: {
    type: String,
    required: [true, "Please enter the company email"],
    unique: true,
    validate: [validator.isEmail, "Please provide an valid email"],
  },
  address: {
    type: String,
    required: [true, "Please enter your address"],
    trim: true,
  },
});

// const joiUserSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().lowercase().required(),
//   password: Joi.string().required(),
//   passwordConfirm: Joi.any().equal(Joi.ref('password')).required(),
// });

// var userSchema = new mongoose.Schema(joigoose.convert(joiUserSchema));

userSchema.pre("save", async function (next) {
  //this function only run if password is modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 16
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
