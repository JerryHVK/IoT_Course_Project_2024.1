const express = require('express');
const healthIndexesController = require('./../controllers/healthIndexesController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, healthIndexesController.getData);
