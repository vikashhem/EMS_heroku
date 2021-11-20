const express = require('express');
// const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/mytasks', userController.getMyTasks);
router.post('/register', userController.userSignup);
router.patch('/updateToken', userController.updateTokenOfUser);
router.post('/login', userController.userLogin);

router.patch(
  '/updatePhoto/:username',
  userController.uploadProfileImage,
  userController.updatePhoto
);

router.patch('/:username', userController.updateUser);

module.exports = router;
