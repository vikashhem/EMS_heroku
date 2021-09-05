const express = require('express');
const router = express.Router();
const testingController = require('./../controllers/testingController');
// var upload = multer({ dest: '/images/' });

router
  .route('/')
  .post(testingController.createToken)
  .get(testingController.getAllTokens);

router.route('/testing').post(testingController.testingMulter);

// router
//   .route('/savingData')
//   .get(testingController.savingData)
//   .post(testingController.savingData);

router.route('/sendNotification').get(testingController.sendNotification);

module.exports = router;
