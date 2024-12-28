const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true, // Tam: this flag activates newer engine for server discovery and monitoring
    });

    console.log('DB connected successfully!');
  } catch (err) {
    console.error('DB connection failed', err);
    process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports = dbConnect;
