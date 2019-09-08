import path from "path";
import { BrowserWindow, Notification } from "electron";
import _ from "lodash";

export const createWindow = options => {
  const {
    url,
    openDevTools,
    onOpenCallback,
    onCloseCallback,
    onLoadHref,
    width = 1000,
    height = 1000,
    webPreferences = {}
  } = options;
  let win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      ...webPreferences
    }
  });

  try {
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
  } catch (err) {
    win.close();
    win = null;
    const notice = new Notification({
      body: `创建新的界面失败，请检查地址是否正确`
    });
    notice.show();
  }
};
