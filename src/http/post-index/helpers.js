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

exports.shouldAskForSupport = () => {
  // If the number is divisible by 7, then try selling.
  // Using 7 since 7 is prime and the unbiased probability of
  // generating a multiple of 7 between 2 and 10 should be 1/10
  // So for now, we are just selling to 1 in 10 requests

  // To double the probability, use 5 (5 & 10). Or to triple, use 3 (3, 6, 9).

  if (Math.ceil(Math.random() * 10) % 7 === 0) return true;
  else return false;
};

exports.appendAskForSupport = () => {
  // add url of the website where to redirect users
  return;
};
