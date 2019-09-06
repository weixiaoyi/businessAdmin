import { autorun, computed, observable } from "mobx";
import ModelExtend from "./modelExtend";
import { notification } from "antd";

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
        if (len > 0)
          notification.info({
            message: `新增了${len}条数据！`
          });
        this.commit({
          answers: data,
          pagination: {
            total,
            pageSize,
            current
          }
        });
      });
    window.ipc.on("scrapy.delete-answers", (e, arg) => {
      notification.success({
        message: "answer删除",
        description: `answerId:${arg}被删除`
      });
      this["ipc-get-scrapy-answers"]();
    });
    window.ipc.on("scrapy.update-answers", (e, arg) => {
      notification.success({
        message: "answer更新",
        description: `answerId:${arg}更新成功`
      });
      this["ipc-get-scrapy-answers"]();
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

  "ipc-get-scrapy-answers" = ({ current, pageSize } = {}) => {
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

  "ipc-update-answer" = ({ answerId, content }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "scrapy.update-answers",
          answerId,
          content
        }
      });
  };

  "ipc-delete-answer" = ({ answerId }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "scrapy.delete-answers",
          answerId
        }
      });
  };
}
