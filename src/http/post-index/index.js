let arc = require("@architect/functions");
let parseBody = arc.http.helpers.bodyParser;

// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  console.log(req);
  console.log(parseBody(req));
  return {
    headers: {
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      "content-type": "text/html; charset=utf8",
    },
    body: `<div>Hello World</div>`,
  };
};
