const path = require("path");
const { shell } = require("electron");
const {
  getXianyuDb,
  ensureDir,
  outputFile,
  setDataPath
} = require("../../utils");
const { PATH } = require("../../constants");
const { download_image, openPath } = require("../common");

const xianyuImageDb = "imagesDb";

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
  const productId = message.url.replace(/.*id=(.*)$/g, "$1");
  const dir = path.join(setDataPath(), PATH.xianyuImageDir, productId);
};

exports.get_imageDb = async ({ args, win }) => {
  const xianyuDb = await getXianyuDb(xianyuImageDb);
  const result = xianyuDb.get("images").value();
  win.webContents.send("xianyu.get_imageDb", {
    data: result
  });
};

// 下载图片
exports.download_image = async ({ args, win }) => {
  const {
    data: { dataUrl, filename, productId, index }
  } = args;
  const dir = path.join(setDataPath(), PATH.xianyuImageDir, productId);
  download_image({
    dataUrl,
    dir,
    filename,
    success: async result => {
      const xianyuDb = await getXianyuDb(xianyuImageDb);
      const findOne = xianyuDb
        .get("images")
        .find({ productId, filename })
        .value();
      if (!findOne) {
        const result = await xianyuDb
          .get("images")
          .unshift({
            productId,
            filename,
            index,
            createTime: Date.now()
          })
          .write()
          .catch(() => null);
        win.webContents.send("xianyu.update-imageDb", { data: result });
      }
      win.webContents.send("xianyu.download-image", result);
    }
  });
};

exports.open_productIdPath = async ({ args, win }) => {
  const {
    data: { productId }
  } = args;
  const dir = path.join(setDataPath(), PATH.xianyuImageDir, productId);
  openPath({ dir });
};

exports.get_imagePath = async ({ args, win }) => {
  const dir = path.join(setDataPath(), PATH.xianyuImageDir);
  win.webContents.send("xianyu.get_imagePath", { dir });
};
