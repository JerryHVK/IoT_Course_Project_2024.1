const Device = require('../models/deviceModel');

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
}
