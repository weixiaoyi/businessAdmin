const path = require("path");
const { BrowserWindow, Notification } = require("electron");
const _ = require("lodash");

const create = options => {
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
    if (/^https?:\/\//.test(url)) {
      win.loadURL(url);
    } else {
      win.loadFile(url);
    }
    win.webContents.on("new-window", (event, href) => {
      event.preventDefault();
      win.loadURL(_.isFunction(onLoadHref) ? onLoadHref(href) : href);
    });
    openDevTools && win.webContents.openDevTools();
    if (_.isFunction(onOpenCallback)) {
      onOpenCallback(win);
    }
    win.on("closed", () => {
      win = null;
      _.isFunction(onCloseCallback) && onCloseCallback(win);
    });
    return win;
  } catch (err) {
    // win.close();
    // win = null;
    const notice = new Notification({
      body: `创建新的界面失败，请检查地址是否正确${JSON.stringify(err)}`
    });
    notice.show();
  }
};

exports.createWindow = create;
