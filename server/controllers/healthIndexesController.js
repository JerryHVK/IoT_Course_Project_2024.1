const HealthIndexes = require('../models/heathIndexesModel');
const catchAsync = require('../utils/catchAsync');

// save data
exports.saveData = async (req, res, next) => {
  try {
    let data;
    data.heartRate = req.data.heartRate;
    data.spo2 = req.data.spo2;
    await HealthIndexes.findOneAndUpdate(
      { user: req.userId },
      { $push: { data } },
    );
  } catch (error) {
    console.log('ERROR in saving data from device to database');
  }
};


// get data: day, month, year
exports.getDataByDuration = catchAsync(async (req, res, next) => {
  const day = req.params.day * 1; // trick to convert string to number
  const month = req.params.month * 1;
  const year = req.params.year * 1;

  // date = one day: day-month-year
  if(date.day){
    const date = new Date(year, month, day);
    const data = await HealthIndexes.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $match: 
      }
    ])
  }
  else if(date.month){
    const date = new Date(year, month);
  }
  else if(date.year){

  }
});

exports.getLatestData = catchAsync(async (req, res, next) => {
  const number = req.params.number || 100;
  const latestData = await HealthIndexes.aggregate([
    {
      $match: { user: req.user._id }, // Match the specific user by their ID
    },
    {
      $project: {
        data: { $slice: ['$data', number*1] }, // Limit the `data` array to the first ${number} elements
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: latestData[0].data.length,
    data: {
      latestData,
    },
  });
});


exports.createFakeData = catchAsync(async(req, res, next) => {
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Generate fake data records
  const fakeData = Array.from({ length: 100 }, () => ({
    heartRate: getRandomInt(48, 120),
    spo2: getRandomInt(96, 100),
  }));

  // Create a new HealthIndexes document
  const newHealthIndexes = new HealthIndexes({
    user: req.user._id,
    data: fakeData,
  });

  // Save the document to the database
  await newHealthIndexes.save();

  res.status(200).json({
    status: "success",
  })
})