import path from "path";
import { BrowserWindow } from "electron";
import _ from "lodash";

export const createWindow = options => {
  const {
    url,
    openDevTools,
    onOpenCallback,
    width = 1000,
    height = 1000
  } = options;
  let win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.loadURL(url);
  openDevTools && win.webContents.openDevTools();
  _.isFunction(onOpenCallback) && onOpenCallback();

  win.on("closed", () => {
    win = null;
  });

  return win;
};
