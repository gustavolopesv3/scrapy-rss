const express = require("express");
const api = express();
const main = require("./scrapy/index");

api.use("/posts", main);

api.listen(3333, () => {
  console.log("Api iniciada");
});
