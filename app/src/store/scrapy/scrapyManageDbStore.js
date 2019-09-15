import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification } from "antd";

export default class ScrapyManageDbStore extends ModelExtend {
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

    window.ipc &&
      window.ipc.on("scrapy.download-pdf", (e, { success, message }) => {
        if (success) {
          notification.success({
            message: `pdf导出成功 ！`
          });
        } else {
          notification.error({
            message
          });
        }
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

  "ipc-create-preview-pdf" = ({ url }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.rootStore.scrapyStore.dbName,
        data: {
          type: "scrapy.create-preview-pdf",
          url
        }
      });
  };

  "ipc-download-pdf" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.rootStore.scrapyStore.dbName,
        data: {
          type: "scrapy.download-pdf"
        }
      });
  };
}
