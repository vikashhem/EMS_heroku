const express = require('express');
// const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/mytasks', userController.getMyTasks);
router.post('/register', userController.userSignup);
router.post('/login', userController.userLogin);

router.patch(
  '/:username',
  //   userController.uploadProfileAndCoverImage,
  //   userController.resizesImages,
  userController.updateUser
);

module.exports = router;
