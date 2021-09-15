const express = require('express');

const chatController = require('../controllers/chatController');
const multerController = require('../controllers/multerController');
const router = express.Router();

router.route('/sendMessage').post(chatController.createChat);
router.route('/getAllMessages').post(chatController.getChatBetweenUsers);
router
  .route('/uploadingFiles')
  .post(multerController.uploadInServer, chatController.uploadToDataBase);

module.exports = router;
