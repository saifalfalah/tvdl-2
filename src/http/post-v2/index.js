// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  const latest = {
    ver: 5000,
    link: "https://www.tvdl.app",
  };
  return {
    headers: {
      "content-type": "application/json; charset=utf8",
    },
    body: JSON.stringify(latest),
  };
};
