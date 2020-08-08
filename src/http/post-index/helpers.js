const parse = require("url-parse");
let isURL = require("is-url");

exports.checkBodyUrl = (body) => {
  if (!body.url) throw new Error("601: No url found");
};

exports.checkIsUrl = (url) => {
  if (!isURL(url)) throw new Error("602: Not a url");
};

exports.checkIfTwitterUrl = (url) => {
  const parsedUrl = parse(url);
  if (
    parsedUrl.hostname !== "twitter.com" &&
    parsedUrl.hostname !== "www.twitter.com" &&
    parsedUrl.hostname !== "mobile.twitter.com"
  )
    throw new Error("603: Not a twitter url");
};

exports.getTweetPath = (url) => parse(url).pathname.split("/")[3];

exports.getApiRequestUrl = (tweetPath) =>
  `https://api.twitter.com/1.1/statuses/show.json?id=${tweetPath}&tweet_mode=extended`;
