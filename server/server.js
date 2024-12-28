const mongoose = require('mongoose');
const dotenv = require('dotenv'); // to get the environment variable

// Listening event "uncaughtException"
// Mình quên mất cái này để làm gì rồi, phải xem lại video nha
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION!!! Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

dotenv.config({ path: './config.env' });

const app = require('./app');
const mqttClient = require('./services/mqttService');
const dbConnect = require('./configs/dbConnect');
dbConnect();
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


// Mình cũng quên mất dòng này để làm gì rồi, xem lại video
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION!!! Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
