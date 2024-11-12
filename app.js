const express = require('express');

const app = express();

app.use(express.json()); // middleware to get the body of the request
app.use(express.static(`${__dirname}/public`)); // set "public" folder is where to get the static files

module.exports = app;