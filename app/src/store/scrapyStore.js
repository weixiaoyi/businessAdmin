import { autorun, computed, observable } from "mobx";
import ModelExtend from "./modelExtend";

export default class ScrapyStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }

  @observable name = "scrapyStore";

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

  "ipc-get-answers" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "get-answers",
          pageSize: 10,
          pageNum: 1
        }
      });
  };
}
