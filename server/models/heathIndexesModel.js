const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  heartRate: {
    type: Number,
    required: true,
  },
  spo2: {
    type: Number,
    require: true,
  }
}, {timestamps: true});

const healthIndexesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'device',
    required: true,
    unique: true,
  },
  data: [dataSchema],
});

const HealthIndexes = mongoose.model('healthIndexes', healthIndexesSchema);

module.exports = HealthIndexes;