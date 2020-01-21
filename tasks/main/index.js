const globalConfig = require("./global");
const scrapy = require("./scrapy");
const online = require("./online");
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

  if (type === "online.test") {
    await online.test({ args, win, app });
  } else if (type === "online.get-product") {
    await online.get_product({ args, win, app });
  } else if (type === "online.download-image") {
    await online.download_image({ args, win, app });
  } else if (type === "online.open-productIdPath") {
    await online.open_productIdPath({ args, win, app });
  } else if (type === "online.get-imageDb") {
    await online.get_imageDb({ args, win, app });
  } else if (type === "online.get-imagePath") {
    await online.get_imagePath({ args, win, app });
  } else if (type === "online.snap-version") {
    await online.snapVersion({ args, win, app });
  } else if (type === "online.get-versionDb") {
    await online.getVersionDb({ args, win, app });
  } else if (type === "online.add-productUrl") {
    await online.addProductUrl({ args, win, app });
  } else if (type === "online.get-productUrls") {
    await online.getProductUrls({ args, win, app });
  } else if (type === "online.remove-productUrl") {
    await online.removeProductUrl({ args, win, app });
  } else if (type === "online.delete-Version") {
    await online.deleteVersion({ args, win, app });
  } else if (type === "online.add-productRemark") {
    await online.addProductRemark({ args, win, app });
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
