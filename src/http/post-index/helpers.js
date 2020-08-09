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
      let size = calculateSizeBitrate(bitrates[0], duration);
      low.size = size;
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
exports.shouldAskForSupport = () => {
  // If the number is divisible by 7, then try selling.
  // Using 7 since 7 is prime and the unbiased probability of
  // generating a multiple of 7 between 2 and 10 should be 1/10
  // So for now, we are just selling to 1 in 10 requests

  // To double the probability, use 5 (5 & 10). Or to triple, use 3 (3, 6, 9).

  // if (Math.ceil(Math.random() * 10) % 7 === 0) return true;
  // else return false;

  // hard return for testing
  return true;
};

exports.appendAskForSupport = (downloadObject) => {
  // add url of the website where to redirect users
  downloadObject["sell"] = "https://www.buymeacoffee.com/saif";
  return downloadObject;
};

const calculateSizeBitrate = (bitrate, duration) => {
  let size = (bitrate * duration) / 8 / 1024 / 1024;
  size = Math.round(size * 100) / 100;
  size = size.toString() + " MB";
  return size;
};

exports.appendLatestVersionInformation = (downloadObject) => {
  downloadObject["ver"] = 5000;
  downloadObject["link"] =
    "https://www.icloud.com/shortcuts/41ed3432ea1e4bc48e881ad608bb355f";
  return downloadObject;
};
