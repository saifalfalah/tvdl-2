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
  `https://api.twitter.com/1.1/statuses/show.json?id=${tweetPath}`;

exports.checkIfContainsVideoOrGif = (data) => {
  if (
    !data.hasOwnProperty("extended_entities") ||
    !data.extended_entities.media[0].video_info
  )
    throw new Error("605: Video / GIF not found");
};

exports.getBitrate = (data) => {
  let variants = data.extended_entities.media[0].video_info.variants;
  variants = variants.filter((el) => el.content_type === "video/mp4");
  variants = variants.map((el) => el.bitrate);
  variants.sort((a, b) => a - b);
  return variants;
};
