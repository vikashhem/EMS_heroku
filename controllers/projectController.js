const Project = require('../models/projectModel');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const NotificationTitle = require('../utils/notificationTitle');
const NotificationFromProject = require('./chatController');

exports.createProject = async (req, res) => {
  try {
    console.log(req.body.owner);
    const admin = await Admin.findOne({ username: req.body.owner });
    console.log(admin);
    if (!admin) {
      res.status(403).json({
        status: false,
        message: 'No such username exists',
      });
    } else {
      const project = await Project.create({
        name: req.body.name,
        description: req.body.description,
        githubLink: req.body.githubLink,
        driveLink: req.body.driveLink,
        documentLink: req.body.documentLink,
        owner: admin._id,
        isActive: true,
        isArchived: false,
        isFav: false,
        completionRatio: -1,
      });

      await Admin.updateOne(
        {
          _id: admin._id,
        },
        {
          $push: {
            projects: {
              projectId: project._id,
              projectName: project.name,
            },
          },
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
    const username = req.query.username;
    console.log(username);
    // what if admin and user have same username
    const user = await User.find({ username: username });
    const admin = await Admin.find({ username: username /*role:hj */ });
    if (!user.length && !admin.length) {
      res.status(400).json({
        status: 1,
        message: 'No such user exists',
      });
      return;
    }
    const projects = user.length ? user[0].projects : admin[0].projects;

    //console.log(projects);
    let allProjects = [];
    for (const Id of projects) {
      // console.log(Id);
      const project = await Project.findById(Id.projectId);
      // console.log(project);
      if (project.isActive) allProjects.push(project);
    }

    allProjects.sort((a, b) => b._id - a._id);
    res.status(201).json({
      status: true,
      length: projects.length,
      allProjects,
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
    const project = await Project.find({ _id: req.params.id, isActive: true });
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
    if (req.body.owner || req.body.isActive) {
      res.status(401).json({
        status: 0,
        message: 'You cannot change the owner or status of project',
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
    await Project.findByIdAndUpdate(
      currId,
      { isActive: false },
      {
        new: true,
        runvalidators: true,
      }
    );
    res.status(200).json({
      status: 1,
      message: 'Successfully deleted',
    });
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const currId = req.params.id;
    if (!user) {
      res.status(403).json({
        status: false,
        message: 'No such user exists',
      });
    } else {
      //only add when active and if the user does not exist
      const project = await Project.findById(currId);
      if (!project || !project.isActive) {
        res.status(200).json({
          status: false,
          message: 'No such Project exists',
        });
        return;
      }

      const member = await project.members.find(
        (member) => JSON.stringify(member.memberId) === JSON.stringify(user._id)
      );
      if (member) {
        res.status(200).json({
          status: false,
          message: 'Member already exists',
        });
        return;
      }

      await Project.updateOne(
        {
          _id: currId,
        },
        {
          $push: {
            members: {
              memberId: user._id,
              memberName: user.username,
            },
          },
        }
      );

      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $push: {
            projects: {
              projectId: project._id,
              projectName: project.name,
            },
          },
        }
      );
      //comment: Notification for adding User to project.

      const token = user.token;
      const title = project.name;
      const message = 'You have been added to the project. -';
      console.log(message);

      const messageToBeSent = NotificationTitle(title, 'Project', message);
      NotificationFromProject.notificationOverall(token, messageToBeSent);

      res.status(200).json({
        status: 1,
        message: 'user successfully added',
      });
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

exports.getAddedUsers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const members = project.members;
    console.log(members);

    let allmembers = [];
    for (const Id of members) {
      const user = await User.findById(Id.memberId);
      console.log(user);
      //if (project.isActive)
      allmembers.push(user);
    }
    //console.log(allmembers);
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
};

exports.findProjects = async (req, res) => {
  try {
    const searchedProjects = req.query.name;
    const data = await Project.find({
      name: { $regex: searchedProjects, $options: 'i' },
    });

    res.status(200).json({
      status: 1,
      results: data.length,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};
