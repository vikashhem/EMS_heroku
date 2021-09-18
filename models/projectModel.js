const mongoose = require('mongoose');
//const validator = require('validator');
//const Admin = require("./AdminModel");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ' Please provide a project name'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please tell about the project'],
  },
  githubLink: {
    type: String,
  },
  driveLink: {
    type: String,
  },
  documentLink: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isArchived:{
    type:Boolean,
    default:false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  members: [
    {
    memberId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    memberName:{
      type:String
    },
  }
  ],
  tasks: [
    {
      taskId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
      taskName:{
        type:String
      },
    }
  ],
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
