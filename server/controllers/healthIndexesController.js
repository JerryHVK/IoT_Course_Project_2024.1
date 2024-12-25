const HealthIndexes = require('../models/heathIndexesModel');
const catchAsync = require('../utils/catchAsync');

// save data
exports.saveData = catchAsync(async(req, res, next) => {
  let data;
  data.heartRate = req.data.heartRate;
  data.spo2 = req.data.spo2;
  await HealthIndexes.findOneAndUpdate({user: req.userId}, {$push: {data}})
});

// get data
exports.getData = catchAsync(async(req, res, next) => {
  
})