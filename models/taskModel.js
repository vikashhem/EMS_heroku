const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskname: {
      type: String,
      required: [true, ' Please provide a project name'],
      trim: true,
    },
    assignedBy: {
      type: String,
      required: [true, ' Please provide owner name'],
    },
    assignedTo: {
      type: String,
      required: [true, ' Please provide a user name'],
    },
    dueDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    isAssigned: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    projectName: {
      type: String,
    },
  },
  { timestamps: { createdAt: 'created_at' } }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
