const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskname: {
    type: String,
    required: [true, ' Please provide a project name'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, ' Please provide a project name'],
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  description: {
    type: String,
    required: [true, 'Please tell about the project'],
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
