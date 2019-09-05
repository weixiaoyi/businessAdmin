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
  @observable pagination = {};

  listenIpc = () => {
    window.ipc &&
      window.ipc.on("scrapy.get-answers", (e, args) => {
        const { data, total, pageSize, current } = args;
        const len = total - this.pagination.total;
        if (len > 0) message.success(`新增了${len}条数据！`);
        this.commit({
          answers: data,
          pagination: {
            total,
            pageSize,
            current
          }
        });
      });
  };

  "ipc-create-answer-preview" = payload => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "scrapy.create-answer-preview",
          url: payload.href
        }
      });
  };

  "ipc-create-scrapy" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "scrapy.create",
          url: "http://zhihu.com"
        }
      });
  };

  "ipc-get-scrapy-answers" = ({ current, pageSize }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "scrapy.get-answers",
          pageSize: pageSize || this.pagination.pageSize || 10,
          pageNum: current || this.pagination.current || 1
        }
      });
  };

  "ipc-update-answer" = () => {};
}
