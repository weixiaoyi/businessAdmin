import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification, message } from "antd";
import { localSave } from "../../utils";
import { db } from "../../constants";
import { uploadAnswer, onlineAnswer } from "../../services";

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
        } else {
          notification.error({
            message: "下载失败",
            description: `图片下载失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.upload-answer-success", (e, arg) => {
        if (arg) {
          notification.success({
            message: "answer上传成功",
            description: `answerId:${arg}上传成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "answer上传失败",
            description: `answerId:${arg}上传失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.online-answer-success", (e, arg) => {
        if (arg) {
          notification.success({
            message: "answer上线成功",
            description: `answerId:${arg}上线成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "answer上线失败",
            description: `answerId:${arg}上线失败`
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

  uploadAnswer = async payload => {
    const res = await uploadAnswer(payload).catch(this.handleError);
    if (res) {
      message.success("上传成功");
      window.ipc &&
        window.ipc.send("ipc", {
          from: "app.wins.main.render",
          dbName: this.dbName,
          data: {
            type: "scrapy.upload-answer-success",
            answerId: payload.answerId
          }
        });
    }
  };

  onlineAnswer = async payload => {
    const res = await onlineAnswer(payload).catch(this.handleError);
    if (res) {
      message.success("上线成功");
      window.ipc &&
        window.ipc.send("ipc", {
          from: "app.wins.main.render",
          dbName: this.dbName,
          data: {
            type: "scrapy.online-answer-success",
            answerId: payload.answerId
          }
        });
    }
  };
}
