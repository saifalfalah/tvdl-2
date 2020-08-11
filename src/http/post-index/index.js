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
  getBitrate,
  shouldAskForSupport,
  makeDownloadObject,
  sanitize,
  appendAskForSupport,
  appendLatestVersionInformation,
} = require("./helpers");

exports.handler = async function http(req) {
  let body = parseBody(req);
  // console.log(body);

  try {
    if (!body) throw new Error(600);

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
    if (!tweetPath) throw new Error(604);
    // console.log(tweetPath);

    // 5. Prepare api request url
    const requestUrl = getApiRequestUrl(tweetPath);
    // console.log(requestUrl);

    // console.log(process.env.TOKEN);
    let data;
    // console.log("Sending request to Twitter API");
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

    let bitrates = getBitrate(data);

    let downloadObject = makeDownloadObject(data, bitrates);

    downloadObject = sanitize(downloadObject);

    // if (shouldAskForSupport() === true)
    downloadObject = appendAskForSupport(downloadObject);

    downloadObject = appendLatestVersionInformation(downloadObject);

    // console.log(downloadObject);
    // console.log(JSON.stringify(downloadObject));

    // return something only if there are no errors.
    return {
      headers: {
        "content-type": "application/json; charset=utf8",
      },
      body: JSON.stringify(downloadObject),
      statusCode: 200,
    };
  } catch (e) {
    // console.log(e.message);
    console.error(e.message);
    let errorMessages = {
      600: "Empty request.",
      601: "No URL found.",
      602: "Not a URL.",
      603: "Not a Twitter URL.",
      604: "Not a tweet.",
      605: "Video / GIF not found.",
    };

    let error;

    if (errorMessages[e.message]) {
      error = {
        error:
          errorMessages[e.message] + " Please update / reset your shortcut.",
      };
    } else
      error = {
        error:
          "Something blew up. Please send an email to tvdl@saif.dev for more help",
      };

    return {
      headers: {
        "content-type": "application/json; charset=utf8",
      },
      body: JSON.stringify(error),
      statusCode: 400,
    };
  } finally {
    // console.log("finally");
    // Save data in begin here
  }
};
