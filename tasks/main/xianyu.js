const path = require("path");
const { shell } = require("electron");
const {
  getScrapyDb,
  ensureDir,
  outputFile,
  setDataPath
} = require("../../utils");
const { PATH } = require("../../constants");
const { download_image } = require("../common");

exports.test = async ({ args, win }) => {
  win.webContents.send("xianyu.test", {
    result: "OK"
  });
};

exports.get_product = async ({ args, win }) => {
  const {
    data: { message }
  } = args;
  win.webContents.send("xianyu.get_product", {
    data: message
  });
};

// 下载图片
exports.download_image = async ({ args, win }) => {
  const {
    data: { dataUrl, filename, productId }
  } = args;
  const dir = path.join(setDataPath(), PATH.xianyuImageDir, productId);
  download_image({
    dataUrl,
    dir,
    filename,
    success: result => win.webContents.send("xianyu.download-image", result)
  });
};
