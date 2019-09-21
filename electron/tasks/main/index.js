import * as scrapy from "./scrapy";
let win;

export default window => {
  win = window;
};

export const messageTasks = async (args, app) => {
  const {
    data: { type }
  } = args;
  if (type === "scrapy.get-answers") {
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
  }
};
