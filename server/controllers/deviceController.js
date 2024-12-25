const Device = require('../models/deviceModel');
const catchAsync = require('../utils/catchAsync');

// USER PERMISSION

// Login Device
// người dùng thực hiện thao tác này để kết nối với device của mình
// mục đích: xác nhận mình sử dụng device này

exports.loginDevice = catchAsync(async (req, res, next) => {
  const { deviceNumber, password } = req.body;
  // 1) Check if device number and password exist
  if (!deviceNumber || !password) {
    return next(
      new AppError('Please provide device number and password!', 400),
    );
  }

  // 2) Check if device exists && does not belong to anyone && password is correct
  let device = await Device.findOne({
    deviceNumber: deviceNumber,
    user: undefined,
  }).select('+password');

  // if the device is undefined, the next condition will not run
  // that will make sure there is no error
  if (!device || !(await device.correctPassword(password, device.password))) {
    return next(new AppError('Incorrect device number or password', 401));
  }

  // 3) If everything ok, update device.user in database
  device = await Device.findOneAndUpdate(
    { deviceNumber },
    { $set: { user: req.user._id } },
  );

  // 4) Send the
  res.status(200).json({
    status: 'success',
    data: {
      device,
    },
  });
});

// Logout Device
// người dùng thực hiện thao tác này để ngắt kết nối với device của mình
// chỉ người dùng sở hữu device mới được thực hiện thao tác này với device
// mục đích: xác nhận mình không còn sử dụng device này
exports.logoutDevice = catchAsync(async (req, res, next) => {
  let device = await Device.findOne({ user: req.user._id });
  if (!device) {
    return next(
      new AppError('You do not have permission to perform this action', 403),
    );
  }

  device = await Device.findOneAndUpdate(
    { user: req.user._id },
    { $set: { user: undefined } },
  );

  res.status(200).json({
    status: 'success',
  });
});

// ADMIN PERMISSION

// Get All Devices
exports.getAllDevices = catchAsync(async (req, res, next) => {
  // we need at least paging for this API
  // so the data need to send back to client is not too much
  const devices = await Device.find().populate('user');

  res.status(200).json()({
    status: 'success',
    results: devices.length,
    data: {
      devices,
    },
  });
});

// Add Device
exports.addDevice = async (req, res) => {
  try {
    await Device.create(req.body);

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// Update Device

// Delete Device

// USER and ADMIN PERMISSION

// Get Device
exports.getDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findOne({ user: req.user._id });
  if (!device) {
    return next(
      new AppError('You do not have permission to perform this action', 403),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      device,
    },
  });
});
