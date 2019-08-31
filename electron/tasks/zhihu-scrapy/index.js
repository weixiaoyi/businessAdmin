import fs from "fs";
import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";

let win;
export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {
  const js = fs.readFileSync(path.join(__dirname, "scrapy.js")).toString();
  win.webContents.on("did-navigate", () => {
    win.webContents.executeJavaScript(js).then(() => {
      win.webContents.send("createUtils", args);
    });
  });
};
