import { autorun, computed, observable } from "mobx";
import ModelExtend from "./modelExtend";

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
