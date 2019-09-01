import { app, ipcMain, BrowserWindow } from "electron";

let win;
export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {};

export const messageTasks = args => {
  console.log(args, "----args");
};
