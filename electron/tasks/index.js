import { app, ipcMain, BrowserWindow } from "electron";
import { createWindow } from "../utils";

ipcMain.on("create-scrapy", (event, args) => {
  if (app.wins.scrapy) return;
  const { url } = args;
  app.wins.scrapy = createWindow({
    width: 800,
    height: 800,
    url,
    onOpenCallback: window => {
      require("./scrapy").default(window, args, app);
    },
    onCloseCallback: () => (app.wins.scrapy = null),
    onLoadHref: href => href.replace(/answer\/.*$/, "")
  });
});

ipcMain.on("ipc_render_message", (event, args) => {
  const { to } = args;
  if (to === "app.wins.main") {
    require("./main").messageTasks(args);
  }
});
