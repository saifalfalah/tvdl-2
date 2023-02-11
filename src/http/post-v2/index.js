const Sdk = require("twitter-api-sdk");
// import { Client } from "twitter-api-sdk";

const client = new Sdk.Client(process.env.TOKEN2);
// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  const tweet = await client.tweets.findTweetById("1577282815250427907", {
    expansions: ["attachments.media_keys"],
    "media.fields": [
      "alt_text",
      "duration_ms",
      "preview_image_url",
      "public_metrics",
      "variants",
    ],
  });
  console.log(tweet);
  console.log(JSON.stringify(tweet.includes.media[0]));
  const latest = {
    ver: 5000,
    link: "https://www.tvdl.app",
  };
  return {
    headers: {
      "content-type": "application/json; charset=utf8",
    },
    body: tweet.includes.media,
  };
};
