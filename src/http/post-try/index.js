// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  let response = {
    high: {
      downloadURL:
        "https://video.twimg.com/ext_tw_video/1050225629256278016/pu/vid/720x1280/V-g_RcEfrouW4HjN.mp4?tag=5",
      size: "1.72 MB",
    },
    medium: {
      downloadURL:
        "https://video.twimg.com/ext_tw_video/1050225629256278016/pu/vid/360x640/BGsKVAaCQXB2ds7f.mp4?tag=5",
      size: "0.66 MB",
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
    ver: 5000,
    link: "https://www.icloud.com/shortcuts/41ed3432ea1e4bc48e881ad608bb355f",
  };
  return {
    headers: {
      "content-type": "application/json; charset=utf8",
    },
    body: JSON.stringify(response),
  };
};
