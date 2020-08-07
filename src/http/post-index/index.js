let arc = require("@architect/functions");
let parseBody = arc.http.helpers.bodyParser;

// learn more about HTTP functions here: https://arc.codes/primitives/http

let bodyURLCheck = (body) => {
  if (!body.url) throw new Error("601: No url");
};

exports.handler = async function http(req) {
  // console.log(req);
  // console.log(parseBody(req));
  let body = parseBody(req);

  try {
    bodyURLCheck(body);
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
  }

  // 1. Check if URL

  // 2. Check if twitter URL

  // 3. Check if the URL contains

  return {
    headers: {
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      "content-type": "text/html; charset=utf8",
    },
    body: `<div>Hello World</div>`,
  };
};
