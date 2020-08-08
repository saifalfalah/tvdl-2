let arc = require("@architect/functions");
let parseBody = arc.http.helpers.bodyParser;
let axios = require("axios");
const {
  checkBodyUrl,
  checkIsUrl,
  checkIfTwitterUrl,
  getTweetPath,
  getApiRequestUrl,
  checkIfContainsVideoOrGif,
} = require("./helpers");

exports.handler = async function http(req) {
  let body = parseBody(req);

  try {
    if (!body) throw new Error("600: Empty Request. Update your shortcut.");

    // 1. Check if the body contains the field url
    checkBodyUrl(body);

    // 2. Check if the field url in the body is a url
    const url = body.url;
    checkIsUrl(url);

    // 3. Check if twitter URL
    checkIfTwitterUrl(url);

    // 4. Check if the URL contains a video
    // Getting the Tweet Path
    const tweetPath = getTweetPath(url);
    if (!tweetPath) throw new Error("604: Not a tweet");

    // 5. Prepare api request url
    const requestUrl = getApiRequestUrl(tweetPath);
    console.log(requestUrl);

    // console.log(process.env.TOKEN);
    let data;

    data = await axios({
      method: "get",
      url: requestUrl,
      headers: {
        authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    data = data.data;

    // console.log(data);

    checkIfContainsVideoOrGif(data);

    // return something only if there are no errors.
    return {
      headers: {
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
        "content-type": "text/html; charset=utf8",
      },
      body: `<div>Hello World</div>`,
    };
  } catch (e) {
    console.log(e.message);
    return {
      headers: {
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
        "content-type": "text/html; charset=utf8",
      },
      body: `<div>${e.message}</div>`,
    };
  } finally {
    // console.log("finally");
    // Save data in begin here
  }
};
