const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const RSS = require("rss");
const express = require("express");

router = express.Router();
setInterval(() => {
  console.log("Nova requisição realizada");
  main();
}, 3600000);

router.get("/up", async (req, res) => {
  await main();
  res.send("ok");
});

router.get("/feed", async (req, res) => {
  const data = fs.readFileSync("./feed.xml");
  res.set("Content-Type", "text/xml");
  return res.send(data);
});

const fetchData = async (url) => {
  const result = await axios.get(url);
  return result.data;
};

const main = async () => {
  const content = await fetchData("https://ac24horas.com/ultimas-noticias/");
  const $ = cheerio.load(content);
  let cards = [];

  $("ul.mvp-blog-story-list >").each((i, e) => {
    const titleCard = $(e).find("h2").text().trim();
    const contentCard = $(e).find("p").text().trim();
    const linkCard = $(e).find("li > a").attr("href");
    const imgCard = $(e)
      .find("li > a > div.mvp-blog-story-out > div.mvp-blog-story-img > img")
      .attr("src");

    let data = { titleCard, contentCard, linkCard, imgCard };
    cards.push(data);
  });
  try {
    createRss(cards);
  } catch (error) {
    console.log(error);
  }
};

function createRss(cards) {
  let feed = new RSS({
    title: "Titulo blog",
    description: "descrição blog",
    //author: 'Gustavo Lopes',
  });
  let data1 = new Date();

  let data2 = new Date(data1.valueOf() - data1.getTimezoneOffset() * 120000);
  var dataBase = data2.toISOString().replace(/\.\d{3}Z$/, "");

  for (const dados of cards) {
    feed.item({
      title: dados.titleCard,
      description: dados.contentCard,
      date: dataBase,
      url: dados.linkCard,
      guid: dados.imgCard,
    });
  }
  cards = "";
  let xml = feed.xml({ indent: true });

  fs.writeFileSync("./feed.xml", xml);
  xml = null;
  feed = null;
  console.log(xml);
}

module.exports = router;
