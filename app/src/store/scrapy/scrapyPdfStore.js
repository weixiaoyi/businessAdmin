import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification } from "antd";

export default class ScrapyPdfStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.listenIpc();
  }
  @observable answers = [];

  listenIpc = () => {
    window.ipc &&
      window.ipc.on("scrapy.get-all-answers", (e, args) => {
        const { data } = args;
        this.commit({
          answers: data
        });
      });
  };

  "ipc-get-scrapy-all-answers" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.rootStore.scrapyStore.dbName,
        data: {
          type: "scrapy.get-all-answers"
        }
      });
  };
}
