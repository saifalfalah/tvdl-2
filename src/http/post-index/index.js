let arc = require("@architect/functions");
let parseBody = arc.http.helpers.bodyParser;
let isURL = require("is-url");

// learn more about HTTP functions here: https://arc.codes/primitives/http

let checkBodyUrl = (body) => {
  if (!body.url) throw new Error("601: No url");
};

let checkIsUrl = (body) => {
  if (!isURL(body.url)) throw new Error("602: Not a url");
};

exports.handler = async function http(req) {
  // console.log(req);
  // console.log(parseBody(req));
  let body = parseBody(req);

  try {
    // 1. Check if the body contains the field url
    checkBodyUrl(body);
    // 2. Check if the field url in the body is a url
    checkIsUrl(body);
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
    // 2. Check if twitter URL
    // 3. Check if the URL contains
    // console.log("finally");
    // Save data in begin here
  }
};
