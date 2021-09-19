const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
// const sharp = require('sharp');n
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Task = require('../models/taskModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const multerStorage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, 'userImages');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|svg|jpeg|jfif)$/)) {
    return cb(new Error('Please upload a image with png jpg svg or jpeg'));
  }
  cb(undefined, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProfileImage = upload.single('userPhoto');

exports.userSignup = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(200).json({
      status: true,
      message: 'User successfully created',
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        status: false,
        message: 'Please enter username and password',
      });
    }

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        status: false,
        message: 'Invalid Credentials',
      });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: 'true',
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: 'false',
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: true,
      users,
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const users = await Task.find({
      assignedTo: req.query.username,
    });
    console.log(users);
    if (!users.length) {
      res.status(403).json({
        status: false,
        message: 'No such user exists',
      });
      return;
    }
    res.status(200).json({
      status: true,
      length: users.length,
      users,
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const username = req.params.username;
    // const thingsToBeUpdated = req.body;
    const user = await User.find({ username });
    let id;

    user.forEach((element) => {
      id = element.id;
    });
    if (req.file) {
      req.body.userPhoto =
        'https://ems-heroku.herokuapp.com/userImages/' + req.file.originalname;
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runvalidators: true,
    });

    res.status(201).json({
      status: true,
      updatedUser,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};
