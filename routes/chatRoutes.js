const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.route('/sendMessage').post(chatController.createChat);
router.route('/uploadSingleImage').post(chatController.up);

module.exports = router;

//  chatController.typeofFile,
