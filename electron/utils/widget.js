import path from "path";
import { BrowserWindow } from "electron";
import _ from "lodash";

export const createWindow = options => {
  const {
    url,
    openDevTools,
    onOpenCallback,
    onCloseCallback,
    onLoadHref,
    width = 1000,
    height = 1000
  } = options;
  let win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.loadURL(url);
  win.webContents.on("new-window", (event, href) => {
    event.preventDefault();
    win.loadURL(_.isFunction(onLoadHref) ? onLoadHref(href) : href);
  });
  openDevTools && win.webContents.openDevTools();
  _.isFunction(onOpenCallback) && onOpenCallback(win);
  win.on("closed", () => {
    win = null;
    _.isFunction(onCloseCallback) && onCloseCallback(win);
  });
  return win;
};
