const Device = require('../models/deviceModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

// USER PERMISSION

// Login Device
// người dùng thực hiện thao tác này để kết nối với device của mình
// mục đích: xác nhận mình sử dụng device này

const loginDevice = catchAsync(async (req, res, next) => {
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
const logoutDevice = catchAsync(async (req, res, next) => {
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

// Get Device
const getDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findOne({ user: req.user._id });
  console.log(req.user._id);
  if (!device) {
    return next(new AppError('There is no device belonging to you', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      device,
    },
  });
});

// ADMIN PERMISSION

// Get All Devices
const getAllDevices = catchAsync(async (req, res, next) => {
  // we need at least paging for this API
  // so the data need to send back to client is not too much
  const devices = await Device.find().populate('user');

  res.status(200).json({
    status: 'success',
    results: devices.length,
    data: {
      devices,
    },
  });
});

// Add Device
const addDevice = catchAsync(async (req, res) => {
  await Device.create(req.body);

  res.status(200).json({
    status: 'success',
  });
});

// Update Device
const updateDevice = catchAsync(async (req, res, next) => {
  const { deviceNumber, password } = req.body;

  // 1) Check if the device exists
  const device = await Device.findOne({ deviceNumber });

  if (!device) {
    return next(new AppError('Device not found', 404));
  }

  // 2) Ensure the device owner or admin is performing the update
  if (req.user._id.toString() !== device.user.toString() && !req.user.isAdmin) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  // 3) If a new password is provided, hash it before saving
  if (password) {
    device.password = password;  // you can add password validation logic here if needed
    await device.save();  // This will trigger the pre-save middleware to hash the password
  }

  // 4) Update the device information (you can update other fields as necessary)
  Object.assign(device, req.body); // Merge the updated fields from the request body into the device

  await device.save();

  res.status(200).json({
    status: 'success',
    data: {
      device,
    },
  });
});

// Delete Device
const deleteDevice = catchAsync(async (req, res, next) => {
  // 1) Check if the device exists and belongs to the logged-in user or admin
  const device = await Device.findOne({ user: req.user._id });

  if (!device) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  // 2) Delete the device from the database
  await device.remove();

  res.status(204).json({
    status: 'success',
    message: 'Device deleted successfully',
  });
});


// USER and ADMIN PERMISSION

module.exports = {
  loginDevice,
  logoutDevice,
  getDevice,
  getAllDevices,
  addDevice,
  updateDevice,
  deleteDevice
}