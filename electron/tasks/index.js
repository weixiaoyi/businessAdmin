import { app, ipcMain, BrowserWindow } from "electron";
import { createWindow } from "../utils";

ipcMain.on("ipc", (event, args) => {
  const {
    from,
    data,
    data: { type }
  } = args;
  if (!from || !data || !type) return console.log("来自渲染进程的ipc参数错误");
  if (from === "app.wins.main.render") {
    if (type === "scrapy.create") {
      if (app.wins.scrapy) return;
      const { url } = data;
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
    } else if (type === "scrapy.create-answer-preview") {
      const { url } = data;
      createWindow({
        width: 800,
        height: 800,
        url
      });
    } else {
      require("./main").messageTasks(args);
    }
  } else if (from === "app.wins.scrapy.render") {
    require("./scrapy").messageTasks(args);
  }
});
