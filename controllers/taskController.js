const admin = require('firebase-admin');
const serviceAccount = require('../key.json');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const notification = require('./chatController');

const NotificationTitle = (task) => {
  return {
    notification: {
      title: `${task}`,
      body: 'Task has been assigned.',
    },
    data: {
      type: 'task',
    },
  };
};

exports.createTask = async (req, res) => {
  try {
    const user1 = await User.find({
      username: req.body.assignedTo,
    });
    console.log(user1);
    const admin = await Admin.find({
      username: req.body.assignedBy,
    });
    const project = await Project.findById(req.path.split('/')[1]);
    if (!user1.length) {
      res.status(403).json({
        status: false,
        message: 'No such user exists',
      });
      return;
    }
    if (!admin.length) {
      res.status(403).json({
        status: false,
        message: 'No such admin exists',
      });
      return;
    }
    if (!project) {
      res.status(403).json({
        status: false,
        message: 'No such project exists',
      });
      return;
    }

    user1.forEach((element) => {
      token = element.token;
    });
    if (!token) {
      throw new Error('No token found');
    }
    console.log(token);

    const notification_options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
    const options = notification_options;

    const MessageToBeSent = NotificationTitle(req.body.taskname);
    console.log(MessageToBeSent);

    notification.notificationOverall(token, MessageToBeSent, options);

    const task = await Task.create({
      taskname: req.body.taskname,
      assignedBy: req.body.assignedBy,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      description: req.body.description,
      assigned: req.body.assigned || true,
      priority: req.body.priority || 0,
      status: req.body.status || 0,
      isCompleted: req.body.isComplete || false,
      isDeleted: false,
      projectId: project._id,
      projectName: project.name,
    });
    //console.log(req.params.id);

    await Project.updateOne(
      {
        _id: req.params.id,
      },
      {
        $push: {
          tasks: {
            taskId: task._id,
            taskName: req.body.taskname,
          },
        },
      }
    );
    res.status(200).json({
      status: 1,
      task,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const currId = req.params.id;
    console.log(currId);
    const updatedTask = await Task.findByIdAndUpdate(currId, req.body, {
      new: true,
      runvalidators: true,
    });
    console.log(updatedTask);
    res.status(200).json({
      status: 1,
      updatedTask,
    });
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const tasks = project.tasks;
    console.log(tasks);

    let allTasks = [];
    for (const Id of tasks) {
      const task = await Task.findById(Id.taskId);
      console.log(task.isDeleted);
      if (!task.isDeleted) allTasks.push(task);
    }
    console.log(allTasks);
    res.status(200).json({
      status: 1,
      length: allTasks.length,
      allTasks,
    });
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    console.log(task);
    res.status(200).json({
      status: 1,
      task,
    });
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const currId = req.params.id;
    await Task.findByIdAndUpdate(
      currId,
      { isDeleted: true },
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
