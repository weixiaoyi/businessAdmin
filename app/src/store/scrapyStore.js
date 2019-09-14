import { autorun, computed, observable } from "mobx";
import ModelExtend from "./modelExtend";
import { notification } from "antd";
import { localSave } from "../utils";
import { db } from "../constants";

export default class ScrapyStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.listenIpc();
    autorun(() => {
      localSave.set("scrapy_dbName", this.dbName);
    });
  }

  @observable name = "scrapyStore";
  @observable answers = [];
  @observable pagination = {};
  @observable dbName = localSave.get("scrapy_dbName") || db.scrapy[0].name;

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

    window.ipc &&
      window.ipc.on("scrapy.delete-answers", (e, arg) => {
        if (arg) {
          notification.success({
            message: "answer删除成功",
            description: `answerId:${arg}被删除`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "answer删除失败",
            description: `answerId:${arg}，删除失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.mass-delete-answers", (e, arg) => {
        if (arg) {
          notification.success({
            message: "answer批量删除成功",
            description: `answerId:${arg}被删除`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "answer批量删除失败",
            description: `answerIds:${arg}，删除失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.update-answers", (e, arg) => {
        if (arg) {
          notification.success({
            message: "answer更新成功",
            description: `answerId:${arg}更新成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "answer未找到，更新失败",
            description: `answerId:${arg}未找到，更新失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.download-image", (e, arg) => {
        if (arg) {
          notification.success({
            message: "图片下载成功",
            description: `${arg}下载成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "下载败",
            description: `图片下载失败`
          });
        }
      });
  };

  "ipc-create-answer-preview" = payload => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.create-answer-preview",
          url: payload.href
        }
      });
  };

  "ipc-create-scrapy" = ({ url = "http://zhihu.com" }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.create",
          url
        }
      });
  };

  "ipc-get-scrapy-answers" = ({ current, pageSize } = {}) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.get-answers",
          pageSize: pageSize || this.pagination.pageSize || 10,
          pageNum: current || this.pagination.current || 1
        }
      });
  };

  "ipc-update-answer" = ({ answerId, ...rest }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.update-answers",
          answerId,
          ...rest
        }
      });
  };

  "ipc-delete-answer" = ({ answerId }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.delete-answers",
          answerId
        }
      });
  };

  "ipc-mass-delete-answer" = ({ answerIds }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.mass-delete-answers",
          answerIds
        }
      });
  };

  "ipc-download-image" = ({ dataUrl, filename }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.download-image",
          dataUrl,
          filename
        }
      });
  };

  "ipc-save-to-pdf" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        dbName: this.dbName,
        data: {
          type: "scrapy.savePdf"
        }
      });
  };
}
