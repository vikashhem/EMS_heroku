const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Task = require('../models/taskModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const updateToken = require('../utils/updateToken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const multerStorage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, 'data');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error('Please upload a image '));
  }
  cb(undefined, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProfileImage = upload.single('userPhoto');

exports.userSignup = catchAsync(async (req, res, next) => {
  // console.log(req.body.companyId);
  const admin = await Admin.findById(req.body.companyId);
  // console.log(admin);
  if (!admin) {
    return next(AppError('No such company id exist', 400));
  }
  const user = await User.create(req.body);
  // console.log(user);
  await Admin.updateOne(
    {
      _id: admin._id,
    },
    {
      $push: {
        employees: {
          employeeId: user._id,
          employeeName: user.username,
        },
      },
    }
  );
  res.status(200).json({
    status: true,
    message: 'User successfully created',
    user,
  });
});

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
    // console.log(user);

    res.status(200).json({
      status: true,
      token,
      user,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    // const admin = await Admin.find({ username: req.query.username });

    // console.log(admin[0]);
    // if (!admin.length) {
    //   res.status(404).json({
    //     status: 0,
    //     message: 'No such admin exists',
    //   });
    //   return;
    // }
    // const users = await User.find({
    //   companyId: admin[0]._id,
    // });
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
    const checkUser = await User.find({
      username: req.query.username,
    });
    const checkAdmin = await Admin.find({
      username: req.query.username,
    });
    if (!checkUser.length && !checkAdmin.length) {
      res.status(403).json({
        status: false,
        message: 'No such User exists',
      });
      return;
    }
    let users;
    if (checkAdmin.length) {
      users = await Task.find({
        assignedBy: req.query.username,
        isDeleted: false,
      }).sort({ dueDate: -1 });
    } else {
      users = await Task.find({
        assignedTo: req.query.username,
        isDeleted: false,
      }).sort({ dueDate: -1 });
    }

    //check if user exists
    //send only non deleted tasks
    //console.log(users);
    if (!users.length) {
      res.status(403).json({
        status: false,
        message: 'No Task exists',
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
    console.log(username);
    const user = await User.find({ username });
    let id;
    console.log(user);

    user.forEach((element) => {
      id = element.id;
    });

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runvalidators: true,
    });
    // console.log(updatedUser);
    res.status(200).json({
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

exports.updatePhoto = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.find({ username });
    let id;

    user.forEach((element) => {
      id = element.id;
    });
    if (!req.file) {
      throw new Error('Please upload a image');
    }
    req.body.userPhoto =
      'https://ems-heroku.herokuapp.com/data/' + req.file.originalname;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runvalidators: true,
    });

    const link = updatedUser.userPhoto;

    res.status(201).json({
      status: true,
      link,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

const updateToken = async (model, id, token) => {
  await model.findByIdAndUpdate(
    id,
    {
      token,
    },
    {
      new: true,
      runvalidators: true,
    }
  );
};

exports.updateTokenOfUser = async (req, res) => {
  try {
    let username = req.body.username;
    const { token } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      updateToken(User, user.id, token);
    } else {
      const admin = await Admin.findOne({ username });
      const adminId = admin.id;
      updateToken(Admin, adminId, token);
    }

    console.log(token);
    res.status(201).json({
      status: true,
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};
