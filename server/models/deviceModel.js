const mongoose = require('mongoose');
const validator = require('validator');

const deviceSchema = new mongoose.Schema({
  deviceNumber: {
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
});

deviceSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

deviceSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Device = mongoose.model('device', deviceSchema);

module.exports = Device;