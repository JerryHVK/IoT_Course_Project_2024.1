const express = require('express');
const morgan = require('morgan');
const customerRouter = require('./routes/customerRouter');
const adminRouter = require('./routes/adminRouter');
const cors = require('cors');

const app = express();
app.use(cors());  

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // middleware to get the body of the request
// app.use(express.static(`${__dirname}/public`)); // set "public" folder is where to get the static files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/customer', customerRouter);

app.use('/api/v1/admin', adminRouter);

module.exports = app;