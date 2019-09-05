import { app, ipcMain, BrowserWindow } from "electron";
import { getScrapyDb } from "../../utils";

let win;

export default window => {
  win = window;
};

export const messageTasks = async args => {
  const scrapyDb = getScrapyDb();
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
  }
};
