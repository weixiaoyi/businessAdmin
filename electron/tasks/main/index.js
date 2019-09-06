import { app, ipcMain, BrowserWindow } from "electron";
import { getScrapyDb } from "../../utils";

let win;

export default window => {
  win = window;
};

export const messageTasks = async args => {
  const scrapyDb = await getScrapyDb();
  const {
    data: { type },
    data
  } = args;
  if (type === "scrapy.get-answers") {
    const { pageNum, pageSize } = data;
    const answers = scrapyDb.get("answers").value();
    const list = answers.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    win.webContents.send("scrapy.get-answers", {
      data: list,
      total: answers.length,
      pageSize,
      current: pageNum
    });
  } else if (type === "scrapy.delete-answers") {
    const {
      data: { answerId }
    } = args;
    await scrapyDb
      .get("answers")
      .remove({ answerId })
      .write();
    win.webContents.send("scrapy.delete-answers", answerId);
  }
};
