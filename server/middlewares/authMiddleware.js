const catchAsync = require('../utils/catchAsync');
const { User }  = require('./../models/userModel');

const isAdmin = catchAsync(async(req, res, next) => {
  const { email } = req.User;
  const adminUser = await User.findOne({ email });
    if(adminUser.role != "admin") {
        throw new Error("You are not the Admin!");
    } else {
        next();
    }
});