const express = require('express');
const deviceController = require('./../controllers/deviceController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and the price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

// router
//   .route('/top-5-cheap')
//   .get(tourController.aliasTopTours, tourController.getAllTours);

// router.route('/tour-stats').get(tourController.getTourStats);
// router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), deviceController.getAllDevices)
  .post(authController.protect, authController.restrictTo('admin'), deviceController.addDevice);

router.post(
  '/login',
  authController.protect,
  authController.restrictTo('user'),
  deviceController.loginDevice,
);

router.post(
  '/logout',
  authController.protect,
  authController.restrictTo('user'),
  deviceController.logoutDevice,
);

router
  .route('/:id')
  .get(deviceController.getDevice)
  // .patch(deviceController.updateDevice)
  // .delete(
  //   authController.protect,
  //   authController.restrictTo('admin'),
  //   deviceController.deleteDevice,
  // );

module.exports = router;
