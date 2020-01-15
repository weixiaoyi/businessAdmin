const path = require("path");
const { shell } = require("electron");
const {
  getXianyuImageDb,
  getXianyuVersionDb,
  getXianyuProductDb,
  ensureDir,
  outputFile,
  setDataPath
} = require("../../utils");
const { PATH } = require("../../constants");
const { download_image, openPath } = require("../common");
const { Mail } = require("../../components");

const xianyuImageDb = "imagesDb";
const xianyuVersionDb = "versionDb";
const xianyuProductUrlDb = "productDb";

exports.test = async ({ args, win }) => {
  win.webContents.send("xianyu.test", {
    result: "OK"
  });
};

exports.getProductUrls = async ({ args, win }) => {
  const db = await getXianyuProductDb(xianyuProductUrlDb);
  const results = await db.get("products").value();
  win.webContents.send("xianyu.get_productUrls", {
    data: results
  });
};

exports.removeProductUrl = async ({ args, win }) => {
  const {
    data: { productId }
  } = args;

  const imageDb = await getXianyuImageDb(xianyuImageDb);
  const images = await imageDb
    .get("images")
    .remove({ productId })
    .write()
    .catch(() => null);

  const versionDb = await getXianyuVersionDb(xianyuVersionDb);
  const versions = await Promise.all([
    versionDb
      .get("versions")
      .unset(`autoSnaps.${productId}`)
      .write(),
    versionDb
      .get("versions")
      .unset(`snaps.${productId}`)
      .write()
  ]).catch(() => null);

  const productsDb = await getXianyuProductDb(xianyuProductUrlDb);
  const products = await productsDb
    .get("products")
    .remove({ productId })
    .write()
    .catch(() => null);

  let result;
  if (images && versions && products) {
    result = true;
  } else {
    result = false;
  }

  win.webContents.send("xianyu.remove_productUrl", {
    data: result
  });
};

exports.addProductUrl = async ({ args, win }) => {
  const {
    data: { url }
  } = args;
  const productId = url.replace(/.*id=(.*)$/g, "$1");
  const db = await getXianyuProductDb(xianyuProductUrlDb);
  const values = db.get("products").value();
  if (values.find(item => item.productId === productId) || !productId) return;
  const results = await db
    .get("products")
    .unshift({
      productId,
      url,
      createTime: Date.now()
    })
    .write()
    .catch(() => null);
  win.webContents.send("xianyu.add_productsUrl", {
    data: results
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
  const snaps = xianyuDb.get("versions").value().snaps[productId] || [];
  const results = await xianyuDb
    .get("versions")
    .set(
      `snaps.${productId}`,
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
  const productId = message.url.replace(/.*id=(.*)$/g, "$1");
  win.webContents.send("xianyu.get_product", {
    data: {
      ...message,
      productId
    }
  });

  if (message.errMsg) {
    Mail.send({
      title: `${productId},${message.errMsg}`,
      text: JSON.stringify(message)
    });
    return;
  }

  const xianyuDb = await getXianyuVersionDb(xianyuVersionDb);
  const autoSnaps = xianyuDb.get("versions").value().autoSnaps[productId] || [];
  const findOne = autoSnaps[0];
  const isChange =
    !findOne ||
    (findOne &&
      (findOne.title !== message.title ||
        findOne.sellPrice !== message.sellPrice ||
        findOne.prevPrice !== message.prevPrice ||
        findOne.quality !== message.quality ||
        findOne.fromWhere !== message.fromWhere ||
        findOne.emailPrice !== message.emailPrice ||
        findOne.desc !== message.desc));
  if (isChange) {
    const newSnap = {
      ...message,
      productId,
      createTime: Date.now()
    };
    const results = await xianyuDb
      .get("versions")
      .set(`autoSnaps.${productId}`, [newSnap].concat(autoSnaps).slice(0, 3))
      .write()
      .catch(() => null);
    win.webContents.send("xianyu.update_version", {
      data: results,
      updateInfo: newSnap
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
