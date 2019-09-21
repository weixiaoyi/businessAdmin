import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification, message } from "antd";
import { localSave } from "../../utils";
import { db } from "../../constants";
import {
  uploadAnswer,
  onlineAnswer,
  offlineAnswer,
  deleteLineAnswer,
  updateLineAnswer,
  checkLineAnswer
} from "../../services";

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

    window.ipc &&
      window.ipc.on("scrapy.offline-answer-success", (e, arg) => {
        if (arg) {
          notification.success({
            message: "answer下线成功",
            description: `answerId:${arg}下线成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "answer下线失败",
            description: `answerId:${arg}下线失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.delete-line-answer-success", (e, arg) => {
        if (arg) {
          notification.success({
            message: "线上answer删除成功",
            description: `线上answerId:${arg}删除成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "线上answer删除失败",
            description: `线上answerId:${arg}删除失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.update-line-answer-success", (e, arg) => {
        if (arg) {
          notification.success({
            message: "线上answer更新成功",
            description: `线上answerId:${arg}更新成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "线上answer更新失败",
            description: `线上answerId:${arg}更新失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("scrapy.check-line-answer-success", (e, arg) => {
        if (arg) {
          notification.success({
            message: "answer检测成功",
            description: `answerId:${arg}检测成功`
          });
          this["ipc-get-scrapy-answers"]();
        } else {
          notification.error({
            message: "answer检测失败",
            description: `answerId:${arg}检测失败`
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
    const res = await uploadAnswer({
      ...payload,
      dbName: this.dbName
    }).catch(this.handleError);
    if (res && res.data) {
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

  updateLineAnswer = async payload => {
    const res = await updateLineAnswer(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("更新线上数据成功");
      window.ipc &&
        window.ipc.send("ipc", {
          from: "app.wins.main.render",
          dbName: this.dbName,
          data: {
            type: "scrapy.update-line-answer-success",
            answerId: payload.answerId
          }
        });
    }
  };

  onlineAnswer = async payload => {
    const res = await onlineAnswer(payload).catch(this.handleError);
    if (res && res.data) {
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

  offlineAnswer = async payload => {
    const res = await offlineAnswer(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("下线成功");
      window.ipc &&
        window.ipc.send("ipc", {
          from: "app.wins.main.render",
          dbName: this.dbName,
          data: {
            type: "scrapy.offline-answer-success",
            answerId: payload.answerId
          }
        });
    }
  };

  deleteLineAnswer = async payload => {
    const res = await deleteLineAnswer(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("删除线上answer成功");
      window.ipc &&
        window.ipc.send("ipc", {
          from: "app.wins.main.render",
          dbName: this.dbName,
          data: {
            type: "scrapy.delete-line-answer-success",
            answerId: payload.answerId
          }
        });
    }
  };

  checkLineAnswer = async payload => {
    const res = await checkLineAnswer(payload).catch(this.handleError);
    if (res && res.data) {
      if (res.data.length > 0) {
        const onlineOne = res.data[0];
        window.ipc &&
          window.ipc.send("ipc", {
            from: "app.wins.main.render",
            dbName: this.dbName,
            data: {
              type: "scrapy.check-line-answer-success",
              answerId: payload.answerId,
              online: onlineOne.online || "upload"
            }
          });
      } else if (res.data.length === 0) {
        window.ipc &&
          window.ipc.send("ipc", {
            from: "app.wins.main.render",
            dbName: this.dbName,
            data: {
              type: "scrapy.check-line-answer-success",
              answerId: payload.answerId,
              online: null
            }
          });
      }
    }
  };
}
