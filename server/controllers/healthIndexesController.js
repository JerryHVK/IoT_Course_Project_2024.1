const HealthIndexes = require('../models/healthIndexesModel');
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

/*
// get data: day, month, year
exports.getDataByDuration = catchAsync(async (req, res, next) => {
  const day = req.params.day * 1; // trick to convert string to number
  const month = req.params.month * 1;
  const year = req.params.year * 1;

  // date = one day: day-month-year
  if(day && month && year){
    const date = new Date(year, month, day);
    const data = await HealthIndexes.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $match: {  }
      }
    ])
  }
  else if(month && year){
    const date = new Date(year, month);

  }
  else if(year){

  }
});
*/

exports.getLatestData = catchAsync(async (req, res, next) => {
  const number = req.params.number || 100;
  const latestData = await HealthIndexes.aggregate([
    {
      $match: { user: req.user._id }, // Match the specific user by their ID
    },
    {
      $project: {
        data: { $slice: ['$data', number * 1] }, // Limit the `data` array to the first ${number} elements
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: latestData[0].data.length,
    data: {
      latestData,
    },
  });
});

exports.createBetterFakeData = catchAsync(async (req, res, next) => {
  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateRandomTime = (date) => {
    const randomHour = getRandomInt(0, 23);
    const randomMinute = getRandomInt(0, 59);
    const randomSecond = getRandomInt(0, 59);
    return new Date(date.setHours(randomHour, randomMinute, randomSecond));
  };

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');

  const fakeData = [];

  // Loop through each day of the year
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dailyData = Array.from({ length: 100 }, () => ({
      heartRate: getRandomInt(48, 120), // Random heart rate value
      createdAt: generateRandomTime(new Date(currentDate)), // Random time within the current day
    }));

    // Sort daily data by createdAt in ascending order
    dailyData.sort((a, b) => a.createdAt - b.createdAt);

    fakeData.push(...dailyData);
  }

  // Create a new HealthIndexes document
  const newHealthIndexes = new HealthIndexes({
    user: req.user._id,
    data: fakeData,
  });

  // Save the document to the database
  await newHealthIndexes.save();

  res.status(200).json({
    status: 'success',
    message: 'Yearly fake data created successfully in chronological order!',
  });
});

exports.getHourlyAverageByDay = catchAsync(async (req, res, next) => {
  const { day, month, year } = req.query;
  // const { day, month, year } = req.params;
  console.log(req.query);

  // Check if all parameters are provided
  if (!day || !month || !year) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide day, month, and year parameters',
    });
  }

  // Convert the day, month, year into a Date range
  const startDate = new Date(Date.UTC(year, month-1, day, 0, 0, 0)); // Start of the day
  const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // End of the day
  // console.log(startDate, endDate);

  // Aggregate pipeline to calculate hourly averages
  const results = await HealthIndexes.aggregate([
    {
      $match: {
        user: req.user._id, // Match data for the authenticated user
        'data.createdAt': { $gte: startDate, $lte: endDate }, // Match the date range
      },
    },
    {
      $unwind: '$data', // Unwind the data array
    },
    {
      $match: {
        'data.createdAt': { $gte: startDate, $lte: endDate }, // Match again inside the array
      },
    },
    {
      $group: {
        _id: {
          hour: { $hour: '$data.createdAt' }, // Group by the hour of the day
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$data.createdAt' },
          }, // Group by date
        },
        averageHeartRate: { $avg: '$data.heartRate' }, // Calculate the average heart rate
      },
    },
    {
      $sort: { '_id.hour': 1 }, // Sort by hour
    },
    {
      $project: {
        _id: 0,
        heartRate: '$averageHeartRate', // Rename fields for the final output
        timeStamp: {
          $concat: ['$_id.date', 'T', { $toString: '$_id.hour' }, ':00:00Z'],
        },
      },
    },
  ]);

  // Respond with the results
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: results,
  });
});


exports.getDailyAverageByMonth = catchAsync(async (req, res, next) => {
  const { month, year } = req.query;

  // Validate input
  if (!month || !year) {
    return res.status(400).json({ message: 'Please provide month and year.' });
  }

  // Construct startDate and endDate for the entire month
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)); // Start of the month
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)); // End of the month

  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);

  // Perform the aggregation
  const dailyData = await HealthIndexes.aggregate([
    {
      $match: {
        user: req.user._id,
        'data.createdAt': { $gte: startDate, $lte: endDate }, // Filter by date range
      },
    },
    {
      $unwind: '$data', // Flatten the array of data
    },
    {
      $match: {
        'data.createdAt': { $gte: startDate, $lte: endDate }, // Filter by date range again after unwind
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: '$data.createdAt' }, // Group by day
          month: { $month: '$data.createdAt' },
          year: { $year: '$data.createdAt' },
        },
        averageHeartRate: { $avg: '$data.heartRate' }, // Calculate average heart rate
      },
    },
    {
      $project: {
        _id: 0,
        heartRate: '$averageHeartRate',
        timeStamp: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
      },
    },
    {
      $sort: { timeStamp: 1 }, // Sort by timestamp
    },
  ]);

  // Send response
  res.status(200).json({
    status: 'success',
    results: dailyData.length,
    data: dailyData,
  });
});

exports.getMonthlyAverageByYear = catchAsync(async (req, res, next) => {
  const { year } = req.query;

  // Validate input
  if (!year) {
    return res.status(400).json({ message: 'Please provide the year.' });
  }

  // Construct startDate and endDate for the entire year
  const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0)); // Start of the year
  const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // End of the year

  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);

  // Perform the aggregation
  const monthlyData = await HealthIndexes.aggregate([
    {
      $match: {
        user: req.user._id,
        'data.createdAt': { $gte: startDate, $lte: endDate }, // Filter by year
      },
    },
    {
      $unwind: '$data', // Flatten the array of data
    },
    {
      $match: {
        'data.createdAt': { $gte: startDate, $lte: endDate }, // Filter again after unwind
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$data.createdAt' }, // Group by month
          year: { $year: '$data.createdAt' },
        },
        averageHeartRate: { $avg: '$data.heartRate' }, // Calculate average heart rate
        averageTimestamp: { $avg: { $toLong: '$data.createdAt' } }, // Calculate average timestamp
      },
    },
    {
      $project: {
        _id: 0,
        heartRate: '$averageHeartRate',
        timeStamp: {
          $toDate: '$averageTimestamp', // Convert average timestamp back to date
        },
      },
    },
    {
      $sort: { timeStamp: 1 }, // Sort by timestamp
    },
  ]);

  // Send response
  res.status(200).json({
    status: 'success',
    results: monthlyData.length,
    data: monthlyData,
  });
});
