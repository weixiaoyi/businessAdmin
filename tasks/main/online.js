const path = require("path");
const { shell } = require("electron");
const {
  getOnlineImageDb,
  getOnlineVersionDb,
  getOnlineProductDb,
  ensureDir,
  outputFile,
  setDataPath
} = require("../../utils");
const { PATH } = require("../../constants");
const { download_image, openPath } = require("../common");
const { Mail } = require("../../components");

const onlineImageDb = "imagesDb";
const onlineVersionDb = "versionDb";
const onlineProductUrlDb = "productDb";

exports.test = async ({ args, win }) => {
  win.webContents.send("online.test", {
    result: "OK"
  });
};

exports.getProductUrls = async ({ args, win }) => {
  const db = await getOnlineProductDb(onlineProductUrlDb);
  const results = await db.get("products").value();
  win.webContents.send("online.get_productUrls", {
    data: results
  });
};

exports.removeProductUrl = async ({ args, win }) => {
  const {
    data: { productId }
  } = args;

  const imageDb = await getOnlineImageDb(onlineImageDb);
  const images = await imageDb
    .get("images")
    .remove({ productId })
    .write()
    .catch(() => null);

  const versionDb = await getOnlineVersionDb(onlineVersionDb);
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

  const productsDb = await getOnlineProductDb(onlineProductUrlDb);
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

  win.webContents.send("online.remove_productUrl", {
    data: result
  });
};

exports.addProductUrl = async ({ args, win }) => {
  const {
    data: { url }
  } = args;
  const productId = url.replace(/.*id=(.*)$/g, "$1");
  const db = await getOnlineProductDb(onlineProductUrlDb);
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
  win.webContents.send("online.add_productsUrl", {
    data: results
  });
};

exports.getVersionDb = async ({ args, win }) => {
  const onlineDb = await getOnlineVersionDb(onlineVersionDb);
  const results = onlineDb.get("versions").value();
  win.webContents.send("online.get_versionDb", {
    data: results
  });
};

exports.snapVersion = async ({ args, win }) => {
  const {
    data: { product }
  } = args;
  const productId = product.url.replace(/.*id=(.*)$/g, "$1");
  const onlineDb = await getOnlineVersionDb(onlineVersionDb);
  const snaps = onlineDb.get("versions").value().snaps[productId] || [];
  const results = await onlineDb
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
  win.webContents.send("online.update_version", {
    data: results
  });
};

exports.get_product = async ({ args, win }) => {
  const {
    data: { message }
  } = args;
  const productId = message.url.replace(/.*id=(.*)$/g, "$1");
  win.webContents.send("online.get_product", {
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

  const onlineDb = await getOnlineVersionDb(onlineVersionDb);
  const autoSnaps = onlineDb.get("versions").value().autoSnaps[productId] || [];
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
    const results = await onlineDb
      .get("versions")
      .set(`autoSnaps.${productId}`, [newSnap].concat(autoSnaps).slice(0, 3))
      .write()
      .catch(() => null);
    win.webContents.send("online.update_version", {
      data: results,
      updateInfo: newSnap
    });
  }
};

exports.get_imageDb = async ({ args, win }) => {
  const onlineDb = await getOnlineImageDb(onlineImageDb);
  const result = await onlineDb.get("images").value();
  win.webContents.send("online.get_imageDb", {
    data: result
  });
};

// 下载图片
exports.download_image = async ({ args, win }) => {
  const {
    data: { dataUrl, filename, productId, index }
  } = args;
  const dir = path.join(setDataPath(), PATH.onlineImageDir, productId);
  download_image({
    dataUrl,
    dir,
    filename,
    success: async result => {
      const onlineDb = await getOnlineImageDb(onlineImageDb);
      const findOne = onlineDb
        .get("images")
        .find({ productId, filename })
        .value();
      if (!findOne) {
        const result = await onlineDb
          .get("images")
          .unshift({
            productId,
            filename,
            index,
            createTime: Date.now()
          })
          .write()
          .catch(() => null);
        win.webContents.send("online.update-imageDb", { data: result });
      }
      win.webContents.send("online.download-image", result);
    }
  });
};

exports.open_productIdPath = async ({ args, win }) => {
  const {
    data: { productId }
  } = args;
  const dir = path.join(setDataPath(), PATH.onlineImageDir, productId);
  openPath({ dir });
};

exports.get_imagePath = async ({ args, win }) => {
  const dir = path.join(setDataPath(), PATH.onlineImageDir);
  win.webContents.send("online.get_imagePath", { dir });
};
