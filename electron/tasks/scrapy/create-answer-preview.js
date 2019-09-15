import fs from "fs";
import path from "path";

let win;

export default (window, args) => {
  console.log("kkkkkkkkkkkkkk");
  win = window;
  init(args);
};

const init = args => {
  const js = fs
    .readFileSync(path.join(__dirname, "inject-create-answer-preview.js"))
    .toString();
  win.webContents.on("did-navigate", () => {
    win.webContents.executeJavaScript(js);
  });
};
