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
      require("./zhihu-scrapy").default(window, args, app);
    },
    onCloseCallback: () => (app.wins.zhihuScrapy = null),
    onLoadHref: href => href.replace(/answer\/.*$/, "")
  });
});

ipcMain.on("relyMessage", (event, args) => {
  const { to } = args;
  if (to === "app.wins.main") {
    require("./main").messageTasks(args);
  }
});
