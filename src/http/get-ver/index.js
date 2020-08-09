// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  const latest = {
    ver: 5000,
    link: "https://www.icloud.com/shortcuts/41ed3432ea1e4bc48e881ad608bb355f",
  };
  return {
    headers: {
      "content-type": "application/json; charset=utf8",
    },
    body: JSON.stringify(latest),
  };
};
