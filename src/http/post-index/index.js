let arc = require("@architect/functions");
let data = require("@begin/data");
let parseBody = arc.http.helpers.bodyParser;
let axios = require("axios");
const { toDate, lightFormat } = require("date-fns");
const {
  checkBodyUrl,
  checkIsUrl,
  checkIfTwitterUrl,
  getTweetPath,
  getApiRequestUrl,
  checkIfContainsVideoOrGif,
  getBitrate,
  makeDownloadObject,
  sanitize,
  appendAskForSupport,
  appendLatestVersionInformation,
  checkClientVersion,
} = require("./helpers");

exports.handler = async function http(req) {
  let body = parseBody(req);
  let didUpsell = false;

  try {
    if (!body) throw new Error(600);

    // Check versions
    checkClientVersion(body);

    // 1. Check if the body contains the field url
    checkBodyUrl(body);

    // 2. Check if the field url in the body is a url
    const url = body.url;
    // console.log(url);
    checkIsUrl(url);

    // 3. Check if twitter URL
    checkIfTwitterUrl(url);

    // 4. Check if the URL contains a video
    // Getting the Tweet Path
    const tweetPath = getTweetPath(url);
    if (!tweetPath) throw new Error(604);

    // 5. Prepare api request url
    const requestUrl = getApiRequestUrl(tweetPath);

    let data;
    data = await axios({
      method: "get",
      url: requestUrl,
      headers: {
        authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    data = data.data;

    checkIfContainsVideoOrGif(data);

    let bitrates = getBitrate(data);

    let downloadObject = makeDownloadObject(data, bitrates);

    // console.log(downloadObject);

    downloadObject = sanitize(downloadObject);

    downloadObject = appendAskForSupport(downloadObject);

    if (downloadObject["sell"] === true) didUpsell = true;

    downloadObject = appendLatestVersionInformation(downloadObject, body.ver);

    return {
      headers: {
        "content-type": "application/json; charset=utf8",
      },
      body: JSON.stringify(downloadObject),
      statusCode: 200,
    };
  } catch (e) {
    console.error(e.message);
    let errorMessages = {
      600: "Empty request.",
      601: "No URL found.",
      602: "Not a URL.",
      603: "Not a Twitter URL.",
      604: "Not a tweet.",
      605: "Video / GIF not found.",
      606: "Shortcut compromised.",
      607: "Outdated shortcut version.",
    };

    let error;

    if (errorMessages[e.message]) {
      error = {
        error:
          errorMessages[e.message] +
          " Try Again. If problem persists, please go to www.tvdl.app to update / reset your shortcut.",
      };
    } else
      error = {
        error:
          "An unexpected error occurred. Try again. If problem persists, please send an email to help@tvdl.app for more help",
      };

    return {
      headers: {
        "content-type": "application/json; charset=utf8",
      },
      body: JSON.stringify(error),
      statusCode: 400,
    };
  } finally {
    // Save data in begin here
    // table = requests
    // key = date
    // prop = total number of requests today
    // value = number of requests today

    let table = "requests";
    let key = lightFormat(toDate(Date.now()), "yyyy-MM-dd");
    await data.incr({ table, key, prop: "totalRequests" });
    if (didUpsell) await data.incr({ table, key, prop: "totalUpsells" });
  }
};
