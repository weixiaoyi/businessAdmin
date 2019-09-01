import { app, ipcMain, BrowserWindow } from "electron";

let win;
export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {};

export const messageTasks = args => {
  const { from, data } = args;
  if (from === "app.wins.zhihuScrapy") {
    const { type } = data;
    if (type === "answers") {
      const message = data.message;
      console.log(message);
    }
  }
};
