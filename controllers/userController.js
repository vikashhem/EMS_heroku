const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Task = require('../models/taskModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.userSignup = async (req, res) => {
  try {
    // await User.create({
    //   fullName: req.body.fullName,
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: req.body.password,
    //   passwordConfirm: req.body.passwordConfirm,
    //   designation: req.body.designation,
    //   teamName: req.body.teamName,
    //   projectName: req.body.projectName,
    // });
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


exports.getMyTasks = async (req,res) =>{
  try{
    const users = await Task.find({
      assignedTo:req.query.username
    });
    console.log(users);
    if(!users.length){
      res.status(403).json({
        status: false,
        message: "No such user exists",
      });
      return;
    }
    res.status(200).json({
      status: true,
      length:users.length,
      users,
    });
  }
  catch(err){
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
  
}