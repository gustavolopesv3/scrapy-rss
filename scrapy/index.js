const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const RSS = require("rss");
const express = require("express");
const xml = require("xml");

router = express.Router();

router.get("/teste", (req, res) => {
  main();
  res.send({
    ok: true,
  });
});

const fetchData = async (url) => {
  const result = await axios.get(url);
  return result.data;
};

const main = async () => {
  const content = await fetchData("https://ac24horas.com/");
  const $ = cheerio.load(content);
  let cards = [];

  $(
    "div.mvp-widget-feat2-side > .mvp-widget-feat2-side-list > .mvp-feat1-list > a > .mvp-feat1-list-cont > .mvp-feat1-list-text"
  ).each((i, e) => {
    const titleCard = $(e).find("span").text().replace(/\s/g, "");
    const contentCard = $(e).find("h2").text();

    let data = [{ titleCard, contentCard }];
    cards.push(data);
    try {
      createRss(data);
      data = [];
    } catch (error) {
      console.log(error);
    }
  });
};

function createRss(data) {
  let data1 = new Date();

  let data2 = new Date(data1.valueOf() - data1.getTimezoneOffset() * 120000);
  var dataBase = data2.toISOString().replace(/\.\d{3}Z$/, "");

  for (const dados of data) {
    feed.item({
      title: dados.titleCard,
      description: dados.contentCard,
      date: dataBase,
    });
  }
  const xml = feed.xml({ indent: true });
  fs.writeFileSync("./feed.xml", xml);
}

const feed = new RSS({
  title: "Titulo blog",
  description: "descrição blog",
  author: "Gustavo Lopes",
});

module.exports = router;
