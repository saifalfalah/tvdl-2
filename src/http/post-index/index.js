let arc = require("@architect/functions");
let parseBody = arc.http.helpers.bodyParser;
let isURL = require("is-url");
const parse = require("url-parse");

// learn more about HTTP functions here: https://arc.codes/primitives/http

let checkBodyUrl = (body) => {
  if (!body.url) throw new Error("600: No url found");
};

let checkIsUrl = (url) => {
  if (!isURL(url)) throw new Error("601: Not a url");
};

let checkIfTwitterUrl = (url) => {
  const parsedUrl = parse(url);
  if (
    parsedUrl.hostname !== "twitter.com" &&
    parsedUrl.hostname !== "www.twitter.com" &&
    parsedUrl.hostname !== "mobile.twitter.com"
  )
    throw new Error("602: Not a twitter url");
};

exports.handler = async function http(req) {
  // console.log(req);
  // console.log(parseBody(req));
  let body = parseBody(req);

  try {
    // 1. Check if the body contains the field url
    checkBodyUrl(body);
    // 2. Check if the field url in the body is a url
    const url = body.url;
    checkIsUrl(url);
    // 2. Check if twitter URL
    checkIfTwitterUrl(url);
    // 3. Check if the URL contains

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
    // console.log(e.message);
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
