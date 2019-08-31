import { app, ipcMain, BrowserWindow } from "electron";
import { createWindow } from "../utils";

ipcMain.on("create-zhihu-scrapy", (event, args) => {
  if (app.wins.zhihuScrapy) return;
  const { url } = args;
  app.wins.zhihuScrapy = createWindow({
    width: 800,
    height: 800,
    url,
    onOpenCallback: window => {
      require("./zhihu-scrapy")(window, args, app);
    },
    onCloseCallback: () => (app.wins.zhihuScrapy = null),
    onLoadHref: href => href.replace(/answer\/.*$/, "")
  });
});
