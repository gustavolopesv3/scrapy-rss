const fs = require("fs");
const RSS = require("rss");

const blog = {
  title: "Este é um titulo de teste",
  description: "descrição deste post bla bla bla",
  author: "Gustavo",
  articles: [
    {
      title: "How to Install and Configure Termux for Node.js Development",
      description:
        "In this article, I will show you how to set up a development environment on your phone using Termux and Node.js",
      url: "https://google.com",
      publishedDate: "April 20, 2021 04:00:00 GMT",
    },
  ],
};

const feed = new RSS({
  title: blog.title,
  description: blog.description,
  author: blog.author,
});

for (const article of blog.articles) {
  feed.item({
    title: article.title,
    description: article.description,
    date: article.publishedDate,
  });
}

const xml = feed.xml({ indent: true });
fs.writeFileSync("./feed.xml", xml);
