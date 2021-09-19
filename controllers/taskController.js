const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      taskname: req.body.taskname,
      username: req.body.username,
      dueDate: req.body.dueDate,
      description: req.body.description,
      assigned: req.body.assigned,
      priority: req.body.priority,
      isCompleted: false,
    });
    await Project.updateOne(
      {
        _id: req.params.id,
      },
      {
        $push: { tasks: task._id },
      }
      
      
        const task = await Task.create({
            taskname:req.body.taskname,
            assignedBy:req.body.assignedBy,
            assignedTo:req.body.assignedTo,
            dueDate:req.body.dueDate,
            description:req.body.description,
            assigned:req.body.assigned || true,
            priority:req.body.priority || 0,
            status: req.body.status || 0,
            isCompleted:req.body.isComplete || false,
            isDeleted:false,
            isFavourite:req.body.isFavourite || false,
            projectId:project._id,
            projectName:project.name
        })
        //console.log(req.params.id);
        
          await Project.updateOne(
            {
              _id: req.params.id,
            },
            {
              $push: { tasks:{
                taskId:task._id,
                taskName:req.body.taskname
              }  },
            }
          );
          res.status(200).json({
            status: 1,
            task
          })
    }
    catch(err){
        res.status(400).json({
            status: false,
            message: err.message,
        });  
    }
}

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
      console.log(task)
      console.log(task.isDeleted);
      if(!task.isDeleted) allTasks.push(task);
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
