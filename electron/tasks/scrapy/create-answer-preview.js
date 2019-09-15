import fs from "fs";
import path from "path";

let win;

export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {
  const js = fs
    .readFileSync(path.join(__dirname, "inject-create-answer-preview.js"))
    .toString();
  win.webContents.on("did-navigate", () => {
    win.webContents
      .executeJavaScript(js)
      .then(() => {
        win.webContents.send("scrapy.createUtils", args);
      })
      .catch(err => err);
  });
};
