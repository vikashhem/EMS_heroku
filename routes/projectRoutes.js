const express = require('express');
const projectController = require('../controllers/projectController');
// const Project = require('../models/taskModel');
const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getAddedUsers)
  .post(projectController.addUser)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
