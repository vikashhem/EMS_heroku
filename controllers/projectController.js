const Project = require('../models/projectModel');
// const Admin = require('./../models/adminModel');

exports.createProject = async (req, res) => {
  try {
    // const project = await Project.create({
    //   name: req.body.name,
    //   description: req.body.description,
    //   githubLink: req.body.githubLink,
    //   driveLink: req.body.driveLink,
    //   documentLink: req.body.documentLink,
    // });

    await Project.create(req.body);
    // console.log(`The project id is ${project._id}`);
    res.status(200).json({
      status: true,
      //   token: project._id,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  //   const projects = req.user.projects;
  //   console.log(projects);
  //   if (!projects.length) {
  //     res.status(400).json({
  //       status: 1,
  //       message: 'No projects available',
  //     });
  //   } else {
  //     let allProjects = [];
  //     for (const projectId of projects) {
  //       const project = await Project.findById(projectId);
  //       allProjects.push(project);
  //     }
  //     res.status(200).json({
  //       status: 1,
  //       allProjects,
  //     });
  //   }

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
