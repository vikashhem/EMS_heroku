const Project = require('../models/projectModel');
// const Admin = require('./../models/adminModel');

exports.createProject = async (req, res) => {
  try {
    await Project.create(req.body);
    res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(201).json({
      status: true,
      message: projects,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};
