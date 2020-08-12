let arc = require("@architect/functions");
let parseBody = arc.http.helpers.bodyParser;

exports.handler = async function http(req) {
  let body = parseBody(req);
  console.log(body);
  let response;

  if (body.error === "true") {
    response = {
      error: "URL not found",
    };
  } else {
    response = {
      high: {
        downloadURL:
          "https://video.twimg.com/ext_tw_video/1050225629256278016/pu/vid/720x1280/V-g_RcEfrouW4HjN.mp4?tag=5",
        size: "5.55 MB",
      },
      medium: {
        downloadURL:
          "https://video.twimg.com/ext_tw_video/1050225629256278016/pu/vid/360x640/BGsKVAaCQXB2ds7f.mp4?tag=5",
        size: "1.63 MB",
      },
      low: {
        downloadURL:
          "https://video.twimg.com/ext_tw_video/1050225629256278016/pu/vid/180x320/1TDydRL_AFvzgf4s.mp4?tag=5",
        size: "0.2 MB",
      },
      sell: true,
      sellLink: "https://buymeacoffee.com/saif",
      sellMessage:
        "Thank you for using TVDL. Supporting millions of users costs quite a lot of money. If you like this shortcut, please consider helping me by supporting this shortcut.",
      declineMessage:
        "If you dislike this donation prompt, you can download a version of this shortcut without it, at tvdl.saif.dev. Thank you!",
      ver: 1400,
      updatePrompt: "Shortcut is outdated. Do you wish to update?",
      updateDeclinedPrompt:
        "If you have any feedback, please visit: tvdl.saif.dev",
      latestLink:
        "https://www.icloud.com/shortcuts/41ed3432ea1e4bc48e881ad608bb355f",
    };
  }
  return {
    headers: {
      "content-type": "application/json; charset=utf8",
    },
    body: JSON.stringify(response),
  };
};
