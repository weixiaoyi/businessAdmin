import fs from "fs";
import path from "path";
import { app, ipcMain, BrowserWindow, Notification } from "electron";
import { getScrapyDb } from "../../utils";

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
  const db = getScrapyDb();
  const {
    data,
    data: { type }
  } = args;
  if (type === "push-answers") {
    let newMessageAmount = 0;
    const messages = data.message;
    messages.map(item => {
      const findOne = db
        .get("answers")
        .find({ answerId: item.answerId })
        .value();
      if (!findOne) {
        db.get("answers")
          .unshift({
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
        newMessageAmount++;
      }
    });
    if (newMessageAmount) {
      const notice = new Notification({
        body: `新采集到${newMessageAmount}条数据`,
        silent: true
      });
      notice.show();
    }
  }
};
