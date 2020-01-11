const globalConfig = require("./global");
const scrapy = require("./scrapy");
const xianyu = require("./xianyu");
let win;

exports.default = window => {
  win = window;
};

exports.messageTasks = async (args, app) => {
  const {
    data: { type }
  } = args;

  if (type === "global.config") {
    await globalConfig.config({ args, win, app });
  }

  if (type === "xianyu.test") {
    await xianyu.test({ args, win, app });
  } else if (type === "xianyu.get-product") {
    await xianyu.get_product({ args, win, app });
  } else if (type === "xianyu.download-image") {
    await xianyu.download_image({ args, win, app });
  } else if (type === "xianyu.open-productIdPath") {
    await xianyu.open_productIdPath({ args, win, app });
  } else if (type === "xianyu.get-imageDb") {
    await xianyu.get_imageDb({ args, win, app });
  } else if (type === "xianyu.get-imagePath") {
    await xianyu.get_imagePath({ args, win, app });
  } else if (type === "xianyu.snap-version") {
    await xianyu.snapVersion({ args, win, app });
  } else if (type === "xianyu.get-versionDb") {
    await xianyu.getVersionDb({ args, win, app });
  } else if (type === "xianyu.add-productUrl") {
    await xianyu.addProductUrl({ args, win, app });
  } else if (type === "xianyu.get-productUrls") {
    await xianyu.getProductUrls({ args, win, app });
  }

  if (type === "scrapy.ipc-get-appPath") {
    await scrapy.get_appPath({ args, win, app });
  } else if (type === "scrapy.ipc-openPath") {
    await scrapy.openPath({ args, win, app });
  } else if (type === "scrapy.get-answers") {
    await scrapy.get_answers({ args, win, app });
  } else if (type === "scrapy.get-all-answers") {
    await scrapy.get_all_answers({ args, win, app });
  } else if (type === "scrapy.delete-answers") {
    await scrapy.delete_answers({ args, win, app });
  } else if (type === "scrapy.update-answers") {
    await scrapy.update_answers({ args, win, app });
  } else if (type === "scrapy.mass-delete-answers") {
    await scrapy.mass_delete_answers({ args, win, app });
  } else if (type === "scrapy.download-image") {
    await scrapy.download_image({ args, win, app });
  } else if (type === "scrapy.download-pdf") {
    await scrapy.download_pdf({ args, win, app });
  } else if (type === "scrapy.upload-answer-success") {
    await scrapy.upload_answer_success({ args, win, app });
  } else if (type === "scrapy.online-answer-success") {
    await scrapy.online_answer_success({ args, win, app });
  } else if (type === "scrapy.offline-answer-success") {
    await scrapy.offline_answer_success({ args, win, app });
  } else if (type === "scrapy.delete-line-answer-success") {
    await scrapy.delete_line_answer_success({ args, win, app });
  } else if (type === "scrapy.update-line-answer-success") {
    await scrapy.update_line_answer_success({ args, win, app });
  } else if (type === "scrapy.check-line-answer-success") {
    await scrapy.check_line_answer_success({ args, win, app });
  }
};
