const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

exports.createTask = async (req,res) =>{
    try{
        const task = await Task.create({
            taskname:req.body.taskname,
            username:req.body.username,
            dueDate:req.body.dueDate,
            description:req.body.description,
            assigned:req.body.assigned,
            priority:req.body.priority,
            isCompleted:false
        })
        //console.log(req.params.id);
        await Project.updateOne(
            {
              _id: req.params.id,
            },
            {
              $push: { tasks:task._id },
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

exports.updateTask = async (req,res) =>{

}