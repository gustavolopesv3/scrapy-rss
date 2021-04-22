const express = require('express');
const api = express();
const main = require('./scrapy/index');
const cors = require('cors');

const host = '0.0.0.0';
const port = process.env.PORT || 3333;

api.use(cors());

api.use('/posts', main);

api.listen(port, host, function () {
  console.log(`Server started... ${port}`);
});
