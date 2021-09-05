const express = require('express');
const testingController = require('./../controllers/testingController');
const router = express.Router();

router
  .route('/')
  .post(testingController.createToken)
  .get(testingController.getAllTokens);

// router
//   .route('/savingData')
//   .get(testingController.savingData)
//   .post(testingController.savingData);

router.route('/sendNotification').get(testingController.sendNotification);

module.exports = router;
