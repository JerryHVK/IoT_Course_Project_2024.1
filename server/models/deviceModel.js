const mongoose = require('mongoose');
const validator = require('validator');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 16,
    select: false,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  }
});

const Device = mongoose.model('device', deviceSchema);

module.exports = Device;