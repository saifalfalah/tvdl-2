const parse = require("url-parse");
let isURL = require("is-url");
/*
Versions:
1303: v3
1306: v3.1
1307: v3.1 iOS 12 RC1
1308 - v3.1 Max-Q ND Edition
1309: v3.1 iOS 12
*/

// To put a shortcut on update just add it to the "ToUpdate" array.
// To deprecate, put it in the UnSupported array.
let versions = {
  ios12: [1307, 1309],
  ios12ToUpdate: [1307],
  ios12UnSupported: [1301],
  ios13: [1303, 1306, 1308],
  ios13ToUpdate: [],
  ios13UnSupported: [],
};

// let supportedVersions = [1303, 1306, 1307, 1308];
let upForUpdate = [1307];

exports.checkClientVersion = (body) => {
  if (!body.ver) throw new Error(606);
  let supportedVersions = [...versions.ios12, ...versions.ios13];
  // throwing error 607 even if the shortcut versions is anything that's not in ios12 and ios13 arrays
  if (!supportedVersions.includes(parseInt(body.ver))) throw new Error(607);
};

exports.checkBodyUrl = (body) => {
  if (!body.url) throw new Error(601);
};

exports.checkIsUrl = (url) => {
  if (!isURL(url)) throw new Error(602);
};

exports.checkIfTwitterUrl = (url) => {
  const parsedUrl = parse(url);
  if (
    parsedUrl.hostname !== "twitter.com" &&
    parsedUrl.hostname !== "www.twitter.com" &&
    parsedUrl.hostname !== "mobile.twitter.com"
  )
    throw new Error(603);
};

exports.getTweetPath = (url) => parse(url).pathname.split("/")[3];

exports.getApiRequestUrl = (tweetPath) =>
  `https://api.twitter.com/1.1/statuses/show.json?id=${tweetPath}&tweet_mode=extended`;

exports.checkIfContainsVideoOrGif = (data) => {
  if (
    !data.hasOwnProperty("extended_entities") ||
    !data.extended_entities.media[0].video_info
  )
    throw new Error(605);
};

exports.getBitrate = (data) => {
  let variants = data.extended_entities.media[0].video_info.variants;
  variants = variants.filter((el) => el.content_type === "video/mp4");
  variants = variants.map((el) => el.bitrate);
  variants.sort((a, b) => a - b);
  return variants;
};

exports.makeDownloadObject = (data, bitrates) => {
  // final object that gets sent
  let downloadObject = {};
  // for a lack of better way, I create three objects that will be
  // appended to the downloadObject and sent back
  let high = {},
    medium = {},
    low = {};
  // trimming down the data we are working with
  let variants = data.extended_entities.media[0].video_info.variants;
  // saving the duration for size calculation
  let duration = data.extended_entities.media[0].video_info.duration_millis;
  // ms to second
  duration /= 1000;
  // removing anything other than mp4
  variants = variants.filter((el) => el.content_type === "video/mp4");
  // main logic starts here
  // we match the bitrate with the variant array.
  // on match, we store the video url in videoUrl variable
  // and we also calculate the size in MB which is where our
  // duration variable defined earlier comes in handy.
  // We pop the array after every calculation so that we can focus on
  // other sizes on the next iteration of the loop.
  while (bitrates.length > 0) {
    if (bitrates.length === 3) {
      let videoUrl;
      variants.forEach((variant) => {
        if (variant.bitrate === bitrates[2]) videoUrl = variant.url;
      });
      high.downloadURL = videoUrl;
      let size = calculateSizeBitrate(bitrates[2], duration);
      high.size = size;
      downloadObject.high = high;
      bitrates.pop();
    } else if (bitrates.length === 2) {
      let videoUrl;
      variants.forEach((variant) => {
        if (variant.bitrate === bitrates[1]) videoUrl = variant.url;
      });
      medium.downloadURL = videoUrl;
      let size = calculateSizeBitrate(bitrates[1], duration);
      medium.size = size;
      downloadObject.medium = medium;
      bitrates.pop();
    } else if (bitrates.length === 1) {
      let videoUrl;
      variants.forEach((variant) => {
        if (variant.bitrate === bitrates[0]) videoUrl = variant.url;
      });
      low.downloadURL = videoUrl;
      if (duration) {
        let size = calculateSizeBitrate(bitrates[0], duration);
        low.size = size;
      } else {
        low.size = "GIF";
        let name = variants[0].url.split("/")[4];
        name = name.split(".")[0];
        low.name = name;
      }
      downloadObject.low = low;
      bitrates.pop();
    }
  }
  return downloadObject;
};

exports.sanitize = (o) => {
  // note: not sure if sanitize is the right word
  // this method adds structure to the downloadObject as required by our client
  // app. If medium or high quality is not present, it adds those objects to the
  // object with the size property set to NA. This helps the client side to parse
  // the length of the size object and skip showing the length etc as appropriate.
  if (!o.hasOwnProperty("medium")) {
    // define medium
    let medium = {};
    // set size as "NA"
    medium.size = "NA";
    // add same download url as low
    medium.downloadURL = o.low.downloadURL;
    // append it to the object
    o.medium = medium;
  }
  if (!o.hasOwnProperty("high")) {
    // define high
    let high = {};
    // set size as "NA"
    high.size = "NA";
    // add same download url as medium
    high.downloadURL = o.medium.downloadURL;
    // append it to the object
    o.high = high;
  }
  return o;
};

const shouldAskForSupport = () => {
  // If the number is divisible by 7, then try selling.
  // Using 7 since 7 is prime and the unbiased probability of
  // generating a multiple of 7 between 2 and 10 should be 1/10
  // So for now, we are just selling to 1 in 10 requests

  // To double the probability, use 5 (5 & 10). Or to triple, use 3 (3, 6, 9).
  // For upsell in 1 out 10 requests, using 7 (default) since 7 is a prime number
  if (Math.ceil(Math.random() * 10) % 7 === 0) return true;
  else return false;

  // hard return for testing
  // return true;
};

exports.appendAskForSupport = (downloadObject) => {
  if (shouldAskForSupport()) {
    downloadObject["sell"] = true;
    downloadObject["sellLink"] =
      "https://support-tvdl.saifalfalah.workers.dev/";
    downloadObject["sellMessage"] =
      "Thank you for using TVDL. If you like this shortcut, please consider helping me by supporting this shortcut.";
    downloadObject["declineMessage"] =
      "If you dislike this donation prompt, you can download a version of this shortcut without it, at www.tvdl.app. Thank you!";
    downloadObject["yesPrompt"] = "Yes, I will support 😀";
    downloadObject["noPrompt"] = "No, I will not 🙁";
  } else downloadObject["sell"] = false;
  // add url of the website where to redirect users for upsell
  return downloadObject;
};

const calculateSizeBitrate = (bitrate, duration) => {
  let size = (bitrate * duration) / 8 / 1024 / 1024;
  size = Math.round(size * 100) / 100;
  size = size.toString() + " MB";
  return size;
};

exports.appendLatestVersionInformation = (downloadObject, ver) => {
  downloadObject["updatePrompt"] =
    "New version of TVDL is available. Do you wish to update?";
  downloadObject["updateDeclinedPrompt"] =
    "If you have any feedback, please visit: www.tvdl.app";

  ver = parseInt(ver);

  // If it is iOS 12, then send latest link for iOS 12.
  // Otherwise send latest link for iOS 13 & Later.
  if (versions.ios12.includes(ver)) {
    // for iOS 12
    switch (ver) {
      case 1307:
        downloadObject["ver"] = 1309;
        // Confirmed link for 1309
        downloadObject["latestLink"] =
          "https://www.icloud.com/shortcuts/5cf17fe1658641c8b920f601474e5e10";
        break;
      default:
        downloadObject["ver"] = 1309;
        // Confirmed link for 1309
        downloadObject["latestLink"] =
          "https://www.icloud.com/shortcuts/5cf17fe1658641c8b920f601474e5e10";
        break;
    }
  } else {
    // for iOS 13 and beyond
    switch (ver) {
      case 1303:
        downloadObject["ver"] = 1306;
        // link verified for version 1306
        downloadObject["latestLink"] =
          "https://www.icloud.com/shortcuts/a72f16f4e3664c8daa0c0a5fc76182fe";
        break;
      case 1306:
        downloadObject["ver"] = 1306;
        // link verified for version 1306
        downloadObject["latestLink"] =
          "https://www.icloud.com/shortcuts/a72f16f4e3664c8daa0c0a5fc76182fe";
        break;
      case 1308:
        downloadObject["ver"] = 1308;
        // link verified and is for version 1308
        downloadObject["latestLink"] =
          "https://www.icloud.com/shortcuts/8002d771575b42449fbfd14be11e661d";
        break;
      default:
        downloadObject["ver"] = 1306;
        // link verified for version 1306
        downloadObject["latestLink"] =
          "https://www.icloud.com/shortcuts/a72f16f4e3664c8daa0c0a5fc76182fe";
        break;
    }
  }
  return downloadObject;
};
