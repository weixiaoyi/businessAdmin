const path = require("path");
const { shell } = require("electron");
const {
  getXianyuImageDb,
  getXianyuVersionDb,
  ensureDir,
  outputFile,
  setDataPath
} = require("../../utils");
const { PATH } = require("../../constants");
const { download_image, openPath } = require("../common");

const xianyuImageDb = "imagesDb";
const xianyuVersionDb = "versionDb";

exports.test = async ({ args, win }) => {
  win.webContents.send("xianyu.test", {
    result: "OK"
  });
};

exports.getVersionDb = async ({ args, win }) => {
  const xianyuDb = await getXianyuVersionDb(xianyuVersionDb);
  const results = xianyuDb.get("versions").value();
  win.webContents.send("xianyu.get_versionDb", {
    data: results
  });
};

exports.snapVersion = async ({ args, win }) => {
  const {
    data: { product }
  } = args;
  const productId = product.url.replace(/.*id=(.*)$/g, "$1");
  const xianyuDb = await getXianyuVersionDb(xianyuVersionDb);
  const snaps = xianyuDb.get("versions").value().snaps || [];
  const results = await xianyuDb
    .get("versions")
    .set(
      "snaps",
      [
        {
          ...product,
          productId,
          createTime: Date.now()
        }
      ]
        .concat(snaps)
        .slice(0, 3)
    )
    .write()
    .catch(() => null);
  win.webContents.send("xianyu.update_version", {
    data: results
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
  const xianyuDb = await getXianyuVersionDb(xianyuVersionDb);
  const autoSnaps = xianyuDb.get("versions").value().autoSnaps || [];
  const findOne = autoSnaps.find(item => item.productId === productId);
  if (
    !findOne ||
    (findOne &&
      (findOne.title !== message.title ||
        findOne.sellPrice !== message.sellPrice ||
        findOne.prevPrice !== message.prevPrice ||
        findOne.quality !== message.quality ||
        findOne.fromWhere !== message.fromWhere ||
        findOne.emailPrice !== message.emailPrice ||
        findOne.desc !== message.desc))
  ) {
    const results = await xianyuDb
      .get("versions")
      .set(
        "autoSnaps",
        [
          {
            ...message,
            productId,
            createTime: Date.now()
          }
        ]
          .concat(autoSnaps)
          .slice(0, 3)
      )
      .write()
      .catch(() => null);
    win.webContents.send("xianyu.update_version", {
      data: results
    });
  }
};

exports.get_imageDb = async ({ args, win }) => {
  const xianyuDb = await getXianyuImageDb(xianyuImageDb);
  const result = await xianyuDb.get("images").value();
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
      const xianyuDb = await getXianyuImageDb(xianyuImageDb);
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
