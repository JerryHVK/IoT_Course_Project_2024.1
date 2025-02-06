const express = require('express');
const customerController = require('./../controllers/customerController');

const router = express.Router();

router.route('/signup').post(customerController.Signup);
router.route('/login').post(customerController.Login);

router
  .route('/:id/device')
  .get(customerController.getCustomerDevice)
  .post(customerController.addCustomerDevice)
  .delete(customerController.deleteCustomerDevice);
  
module.exports = router;
