const mongoose = require('mongoose');
const dotenv = require('dotenv'); // to get the environment variable
dotenv.config({ path: './config.env' });

const app = require('./app');
const mqttClient = require('./services/mqttService');

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connected successfully!');
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
