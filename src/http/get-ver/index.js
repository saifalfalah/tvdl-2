// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  const latest = 5000;
  return {
    headers: {
      "content-type": "application/json; charset=utf8",
    },
    body: JSON.stringify(latest),
  };
};
