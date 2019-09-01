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
      window.ipc.send("create-scrapy", {
        url: "http://zhihu.com"
      });
  };

  "ipc-get-scrapy-data" = () => {
    console.log("hhhh");
    window.ipc &&
      window.ipc.send("ipc_render_message", {
        from: "app.wins.main",
        to: "app.wins.main",
        data: {
          type: "get-answers"
        }
      });
  };
}
