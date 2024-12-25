const express = require('express');
const adminController = require('./../controllers/adminController');

const router = express.Router();

router.route('/').post(adminController.addDevice).get();

module.exports = router;
