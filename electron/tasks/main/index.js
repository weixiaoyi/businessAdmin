import { app, ipcMain, BrowserWindow } from "electron";

let win;

export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {};

export const messageTasks = async args => {
  const {
    data: { type },
    data
  } = args;
  if (type === "get-answers") {
    const { pageNum, pageSize } = data;
    // const list = db
    //   .get("answers")
    //   .slice((pageNum - 1) * pageSize, pageNum * pageSize)
    //   .value();
    //win.webContents.send("createUtils", list);
  }
};
