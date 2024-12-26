const express = require('express');
const healthIndexesController = require('./../controllers/healthIndexesController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.route('/').get(authController.protect, healthIndexesController.getData);

router
  .route('/fakedata')
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    healthIndexesController.createFakeData,
  );
router
  .route('/:number')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    healthIndexesController.getLatestData,
  );

module.exports = router;
