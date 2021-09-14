const Project = require('../models/projectModel');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

exports.createProject = async (req, res) => {
  try {
    console.log(req.body.owner);
    const admin = await Admin.findOne({ username: req.body.owner });
    console.log(admin);
    if (!admin) {
      res.status(403).json({
        status: false,
        message: "No such username exists",
      });
    } else {
      const project = await Project.create({
        name: req.body.name,
        description: req.body.description,
        githubLink: req.body.githubLink,
        driveLink: req.body.driveLink,
        documentLink: req.body.documentLink,
        owner: admin._id,
        isActive:true,
        isArchived:false
      });

      await Admin.updateOne(
        {
          _id: admin._id,
        },
        {
          $push: { projects: project._id },
        }
      );

      res.status(200).json({
        status: 1,
        token: project._id,
      });
    }
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

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json({
      status: 1,
      project,
    });
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    if (req.body.owner || req.body.isActive ) {
      res.status(401).json({
        status: 0,
        message: "You cannot change the owner or status of project",
      });
    } else {
      const currId = req.params.id;
      const updatedProject = await Project.findByIdAndUpdate(currId, req.body, {
        new: true,
        runvalidators: true,
      });
      res.status(200).json({
        status: 1,
        updatedProject,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const currId = req.params.id;
    const updatedProject = await Project.findByIdAndUpdate(
      currId,
      { isActive: false },
      {
        new: true,
        runvalidators: true,
      }
    );
    res.status(200).json({
      status: 1,
      message:"Successfully deleted"
    });
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};

exports.addUser = async (req,res) =>{
  try{
  const user = await User.findOne({ username: req.body.username });
  const currId = req.params.id;
  if(!user){
    res.status(403).json({
      status: false,
      message: "No such user exists",
    });
  }
  else{
    await Project.updateOne(
      {
        _id: currId,
      },
      {
        $push: { members: user._id },
      }
    );
    res.status(200).json({
      status: 1,
      message:"user successfully added"
    });
  }
}
  catch(err){
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
}

exports.getAddedUsers = async (req,res) =>{
  try{
  const project = await Project.findById(req.params.id);
  const members = project.members;
  console.log(members)
    
      let allmembers = [];
      for (const memberId of members) {
        const user = await User.findById(memberId);
        console.log(user);
        //if (project.isActive)
        allmembers.push(user);
      }
      console.log(allmembers)
      res.status(200).json({
        status: 1,
        length: allmembers.length,
        allmembers,
      });
    
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
}