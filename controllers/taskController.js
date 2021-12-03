const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const notification = require('./chatController');
const findToken = require('../utils/findToken');
const NotificationTitle = require('../utils/notificationTitle');

let findRatio = async (project, taskAdded) => {
  if (!project.isActive) return;
  console.log('in Find Ratio');
  let totalTasks = taskAdded;
  let completedTasks = 0;
  const tasks = project.tasks;
  console.log(tasks);
  //if (!tasks.length) return -1;
  for (const Id of tasks) {
    const task = await Task.findById(Id.taskId);
    //console.log(task.isDeleted);
    if (!task.isDeleted) {
      totalTasks++;
      if (task.isCompleted /*&& task.isVerified*/) completedTasks++;
    }
  }
  let ratio = completedTasks / totalTasks;
  await Project.updateOne(
    {
      _id: project._id,
    },
    {
      $set: {
        completionRatio: ratio,
      },
    }
  );
  console.log(project);
  console.log(totalTasks);
  console.log(ratio);
  return ratio;
};

exports.createTask = async (req, res) => {
  try {
    const user1 = await User.find({
      username: req.body.assignedTo,
    });
    //console.log(user1);
    const admin = await Admin.find({
      username: req.body.assignedBy,
    });
    console.log(admin);
    const project = await Project.find({
      _id: req.path.split('/')[1],
      isActive: true,
    });
    // console.log(project[0]);
    //console.log(user1);
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
    if (!project.length) {
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
    let message = 'Task has been assigned to you.';

    const MessageToBeSent = NotificationTitle(
      req.body.taskname,
      'Task',
      message
    );

    notification.notificationOverall(token, MessageToBeSent);

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
      isVerified: false,
      projectId: project[0]._id,
      projectName: project[0].name,
    });
    //console.log(req.params.id);
    //console.log(project);
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
    //console.log(project);
    //console.log(project[0].tasks);
    let curRatio = await findRatio(project[0], 1);
    // console.log(curRatio);
    res.status(200).json({
      status: 1,
      completionRatio: curRatio,
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
    // console.log(req.body);
    // restrict user and admin
    const updatedTask = await Task.findByIdAndUpdate(currId, req.body, {
      new: true,
      runvalidators: true,
    });
    let check = req.body.isCompleted;

    const project = await Project.find({
      _id: req.path.split('/')[1],
      isActive: true,
    });
    let curRatio = project[0].completionRatio;

    if (check === true || check === false) {
      //console.log(project[0]);
      curRatio = await findRatio(project[0], 0);
    }
    // console.log(curRatio);
    //comment: for notification when the task is updated
    const user = await User.find({ username: updatedTask.assignedTo });
    const admin = await Admin.find({ username: updatedTask.assignedBy });

    let tokens = [];
    tokens.push(findToken(user), findToken(admin));

    const message = 'Task has been updated.';

    const MessageToBeSent = NotificationTitle(
      updatedTask.taskname,
      'Task',
      message
    );

    notification.notificationOverall(tokens, MessageToBeSent);

    res.status(200).json({
      status: 1,
      completionRatio: curRatio,
      updatedTask,
    });
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
};

exports.verifyTask = async (req, res) => {
  //comment: admin check ?
  try {
    const currId = req.params.id;
    const task = await Task.find({ _id: currId, isDeleted: false });
    console.log(task);
    if (!task.length) {
      res.status(403).json({
        status: false,
        message: 'No such task exists',
      });
      return;
    }

    if (!task[0].isCompleted) {
      res.status(403).json({
        status: false,
        message: 'Task is not completed by user',
      });
      return;
    }
    const updatedTask = await Task.findByIdAndUpdate(
      currId,
      { isVerified: true },
      {
        new: true,
        runvalidators: true,
      }
    );
    //console.log(task[0].projectId);
    //console.log(req.path.split("/")[1]);
    const project = await Project.find({
      _id: req.path.split('/')[1],
      isActive: true,
    });

    console.log(project[0]);
    let curRatio = await findRatio(project[0], 0);

    //console.log(updatedTask);
    res.status(200).json({
      status: 1,
      completionRatio: curRatio,
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
    console.log(project);

    let allTasks = [];
    for (const Id of tasks) {
      const task = await Task.findById(Id.taskId);
      //console.log(task.isDeleted);
      if (!task.isDeleted) allTasks.push(task);
    }
    allTasks.sort((a, b) => b.dueDate - a.dueDate);
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
    const task = await Task.find({ _id: req.params.id, isDeleted: false });
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
