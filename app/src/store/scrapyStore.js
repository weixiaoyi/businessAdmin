import { autorun, computed, observable } from "mobx";
import ModelExtend from "./modelExtend";
import { message } from "antd";

export default class ScrapyStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.listenIpc();
  }

  @observable name = "scrapyStore";
  @observable answers = [];

  listenIpc = () => {
    window.ipc &&
      window.ipc.on("get-scrapy-answers", (e, args) => {
        const newAmounts = args.reduce((sum, item) => {
          if (!this.answers.find(one => one.answerId === item.answerId)) {
            sum++;
          }
          return sum;
        }, 0);
        if (newAmounts > 0 && this.answers.length)
          message.success(`新增了${newAmounts}条数据！`);
        this.commit("answers", args);
      });
  };

  "ipc-create-answer-preview" = payload => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "create-answer-preview",
          url: payload.href
        }
      });
  };

  "ipc-create-scrapy" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "create-scrapy",
          url: "http://zhihu.com"
        }
      });
  };

  "ipc-get-scrapy-answers" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "get-scrapy-answers",
          pageSize: 10,
          pageNum: 1
        }
      });
  };
}
