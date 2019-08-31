import fs from "fs";
import path from "path";
import { ipcMain, BrowserWindow } from "electron";
import { createWindow } from "../../utils";

ipcMain.on("createBrowser", (event, arg) => {
  const { url } = arg;
  const win = createWindow({
    width: 800,
    height: 800,
    url
  });
  const js = fs.readFileSync(path.join(__dirname, "scrapy.js")).toString();

  console.log(js, "----");

  win.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    win.loadURL(url);
  });
  win.webContents.on("did-navigate", () => {
    // win.webContents.executeJavaScript(js);
  });
});
