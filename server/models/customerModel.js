const mongoose = require('mongoose');
const validator = require('validator');

const dataSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  heartRate:{
    type: Number,
    required: true,
  },
  spo2:{
    type: Number,
    require: true,
  }
});

const spo2DataSchema = new mongoose.Schema({});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Customer's name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Customer's email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  data: [dataSchema],
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'device',
  },
});

const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;