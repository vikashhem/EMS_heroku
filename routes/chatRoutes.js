const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.route('/sendMessage').post(chatController.createChat);
router
  .route('/uploadingFiles')
  .post(chatController.uploadInServer, chatController.uploadToDataBase);

module.exports = router;

//  chatController.typeofFile,
