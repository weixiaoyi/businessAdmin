import { app, ipcMain, BrowserWindow } from "electron";
import { getScrapyDb } from "../../utils";

const scrapyDb = getScrapyDb();

let win;

export default window => {
  win = window;
};

export const messageTasks = async args => {
  const {
    data: { type },
    data
  } = args;
  if (type === "get-scrapy-answers") {
    const { pageNum, pageSize } = data;
    const list = scrapyDb
      .get("answers")
      .slice((pageNum - 1) * pageSize, pageNum * pageSize)
      .value();
    win.webContents.send("get-scrapy-answers", list);
  }
};
