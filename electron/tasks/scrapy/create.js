import fs from "fs";
import path from "path";
import { Notification } from "electron";
import { getScrapyDb } from "../../utils";

let win;
export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {
  const js = fs
    .readFileSync(path.join(__dirname, "inject-create.js"))
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

export const messageTasks = async args => {
  const {
    dbName,
    data,
    data: { type }
  } = args;
  const db = await getScrapyDb(dbName);
  if (type === "scrapy.push-answers") {
    let newMessageAmount = 0;
    const messages = data.message;
    await Promise.all(
      messages.map(item => {
        const findOne = db
          .get("answers")
          .find({ answerId: item.answerId })
          .value();
        if (!findOne) {
          newMessageAmount++;
          return db
            .get("answers")
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
        }
      })
    ).catch(() => null);
    if (newMessageAmount) {
      const notice = new Notification({
        body: `新采集到${newMessageAmount}条数据`,
        silent: true
      });
      notice.show();
    }
  }
};
