const Customer = require('../models/customerModel');
const Device = require('../models/deviceModel');

// Signup
exports.Signup = async (req, res) => {
  try {
    await Customer.create(req.body);

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(404).json({
      status: 'signup fail',
      message: error,
    });
  }
};

// Login
exports.Login = async (req, res) => {
  try {
    const customerLogin = await Customer.findOne(req.body);

    if (customerLogin) {
      res.status(200).json({
        status: 'success',
        data: customerLogin._id,
      });
    } else {
      res.status(404).json({
        status: 'login fail',
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// TODO: CUSTOMER'S DEVICE API

// get customer's device
exports.getCustomerDevice = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('device');
    res.status(200).json({
      status: 'success',
      data: customer.device,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

/*
exports.addCustomerDevice = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  try {
    // 1. Check if the device is exist: deviceId + password, and does not belong to anyone
    var device = await Device.findOne(req.body);
    if(device.customer){
      res.status(404).json({
        status: 'fail',
        message: 'The id or password is not right, or the device belongs to someone',
      });
    }

    device = await Device.findOneAndUpdate(req.body, {
      customer: customer,
    });
    if (device) {
      try {
        // 2. Customer add existing device
        const cus = await Customer.findByIdAndUpdate(req.params.id, {
          device: device,
        });
        res.status(200).json({
          status: 'success',
          // data: cus.device,
        });
      } catch (error) {
        res.status(404).json({
          status: 'fail',
          message: error,
        });
      }
    } else {
      res.status(404).json({
        status: 'fail',
        message: error,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
*/

// customer add device

exports.addCustomerDevice = async(req, res) => {
  try{
    
    // 1. Check if the device exists: deviceId + password, and does not belong to anyone
    const {deviceId, password} = req.body;
    let device = await Device.findOne({deviceId, password});
    if(device && device.customer){
      return res.status(400).json({
        status: 'fail',
        message: 'This device already belongs to another customer',
      });
    }

    // 2. If the device is valid, update the device with the customer reference
    device = await Device.findOneAndUpdate(
      {deviceId, password},
      {customer: req.params.id}
    );

    // 3. Update the customer with the device reference
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {device: device._id}
    );

    res.status(200).json({
      status: 'success',
    });
  }
  catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Server error',
    });
  }
};

// customer delete device
exports.deleteCustomerDevice = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const deviceId = await customer.device;
    await Customer.findByIdAndUpdate(req.params.id, {device: null});
    await Device.findByIdAndUpdate(deviceId, {customer: null});

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



// customer update devices
// UPDATE = DELETE + ADD


// TODO: CUSTOMER'S DATA API
