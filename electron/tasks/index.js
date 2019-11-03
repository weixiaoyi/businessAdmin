const { app, ipcMain } = require("electron");
const { createWindow } = require("../utils");

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
          require("./scrapy/create").default(window, args, app);
        },
        onCloseCallback: () => (app.wins.scrapy = null),
        onLoadHref: href => href.replace(/answer\/.*$/, "")
      });
    } else if (type === "scrapy.create-preview-pdf") {
      if (app.wins.scrapyPreviewPdf) return;
      const { url } = data;
      app.wins.scrapyPreviewPdf = createWindow({
        width: 800,
        height: 800,
        url,
        onCloseCallback: () => (app.wins.scrapyPreviewPdf = null)
      });
    } else if (type === "scrapy.create-answer-preview") {
      const { url } = data;
      app.wins.scrapyPreviewAnser = createWindow({
        width: 800,
        height: 800,
        url,
        onOpenCallback: window => {
          require("./scrapy/create-answer-preview").default(window, args, app);
          // import("./scrapy/create-answer-preview").then(
          //   result =>
          //     result && result.default && result.default(window, args, app)
          // );
        },
        onCloseCallback: () => (app.wins.scrapyPreviewAnser = null)
      });
    } else {
      require("./main").messageTasks(args, app);
    }
  } else if (from === "app.wins.scrapy.render") {
    require("./scrapy/create").messageTasks(args, app);
  }
});
