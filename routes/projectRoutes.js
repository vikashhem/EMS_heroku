const express = require('express');
const projectController = require('../controllers/projectController');
const Project = require('../models/taskModel');
const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .post(projectController.addUser)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router
  .route('/:id/team')
  .get(projectController.getAddedUsers);

module.exports = router;
