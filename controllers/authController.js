const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const checkActivationToken = (role, token) => {
  if (role === 'admin' && process.env.ACTIVATION_TOKENS.includes(token)) {
    return token;
  } else if (role === 'admin' && token === undefined) {
    throw new Error('Please provide the activation token');
  } else if (
    role === 'admin' &&
    !process.env.ACTIVATION_TOKENS.includes(token)
  ) {
    throw new Error('Please provide the valid activation token');
  } else {
    return undefined;
  }
};

exports.signup = async (req, res) => {
  try {
    const newAdmin = await Admin.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
      // activation_token: checkActivationToken(
      //   req.body.role,
      //   req.body.activation_token
      // ),
      activation_token: req.body.activation_token,
      phoneNumber: req.body.phoneNumber,
      companyName: req.body.companyName,
      companyEmail: req.body.companyEmail,
      companyNumber: req.body.companyNumber,
      companyDescription: req.body.companyDescription,
      address: req.body.address,
    });

    console.log(req.body.activation_token);

    const token = signToken(newAdmin._id);

    res.status(200).json({
      status: true,
      token,
      newAdmin,
      message: 'Admin successfully created',
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        status: false,
        message: 'Please enter username and password',
      });
    }

    const user = await Admin.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        status: false,
        message: 'Invalid Credentials',
      });
    }
    const token = signToken(user._id);
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
