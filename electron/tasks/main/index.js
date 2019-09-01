import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter = new FileSync(
  path.join(__dirname, "../../assets/zhihu-scrapy/db.json"),
  {
    defaultValue: { answers: [] },
    serialize: array => JSON.stringify(array),
    deserialize: string => JSON.parse(string)
  }
);
const db = low(adapter);

let win;

export default (window, args) => {
  win = window;
  init(args);
};

const init = args => {};

export const messageTasks = async args => {
  const { from, data } = args;
  if (from === "app.wins.zhihuScrapy") {
    const { type } = data;
    if (type === "push-answers") {
      const messages = JSON.parse(data.message);
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
  }
};
