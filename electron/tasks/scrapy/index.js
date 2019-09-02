import fs from "fs";
import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import { getScrapyDb } from "../../utils";

const db = getScrapyDb();

let win;
export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {
  const js = fs
    .readFileSync(path.join(__dirname, "inject-scrapy.js"))
    .toString();
  win.webContents.on("did-navigate", () => {
    win.webContents.executeJavaScript(js).then(() => {
      win.webContents.send("createUtils", args);
    });
  });
};

export const messageTasks = async args => {
  const {
    data,
    data: { type }
  } = args;
  if (type === "push-answers") {
    const messages = data.message;
    messages.map(item => {
      const findOne = db
        .get("answers")
        .find({ answerId: item.answerId })
        .value();
      if (!findOne) {
        db.get("answers")
          .push({
            answerId: item.answerId,
            title: item.title,
            questionId: item.questionId,
            authorName: item.authorName,
            authorId: item.authorId,
            content: item.content,
            upVoteNum: item.upVoteNum,
            createTime: Date.now()
          })
          .write();
      }
    });
  }
};
