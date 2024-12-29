const express = require('express');
const healthIndexesController = require('./../controllers/healthIndexesController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.route('/').get(authController.protect, healthIndexesController.getData);

router
  .route('/day')
  .get(authController.protect, healthIndexesController.getHourlyAverageByDay);
router
  .route('/month')
  .get(authController.protect, healthIndexesController.getDailyAverageByMonth);
router
  .route('/year')
  .get(authController.protect, healthIndexesController.getMonthlyAverageByYear);

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
