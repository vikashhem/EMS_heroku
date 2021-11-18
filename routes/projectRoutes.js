const express = require("express");
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");
const router = express.Router();

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router.route("/search").get(projectController.findProjects);

router
  .route("/:id")
  .get(projectController.getProject)
  .post(projectController.addUser)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router.route("/:id/team").get(projectController.getAddedUsers);

router
  .route("/:id/tasks")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id/tasks/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

router.route("/:id/tasks/:id/verify").get(taskController.verifyTask);

//make a func for admin or user check

module.exports = router;
