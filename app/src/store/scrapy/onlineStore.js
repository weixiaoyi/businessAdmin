import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification, message } from "antd";
import {
  getAnswers,
  getOnlineDbs,
  onlineAnswerDb,
  offlineAnswerDb,
  deleteLineDb,
  updateLineDb,
  getUsers,
  operationUserBlackList
} from "../../services";
import { db } from "../../constants";

export default class OnlineStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }
  @observable onlineAnswers = [];
  @observable pagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  @observable localDbs = db.scrapy;
  @observable dbPagination = {
    pageSize: 100,
    current: 1,
    total: 0
  };

  @observable users = [];
  @observable userPagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  getOnlineDbs = async payload => {
    const res = await getOnlineDbs({
      page: this.dbPagination.current,
      pageSize: this.dbPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      dbName: this.rootStore.scrapyStore.dbName
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit(
        "localDbs",
        this.localDbs.map(item => {
          const findOne = res.data.find(one => one.name === item.name) || {};
          return {
            ...item,
            online: findOne.online ? findOne.online : "waiting",
            onlineData: findOne
          };
        })
      );
    }
  };

  getAnswers = async payload => {
    const res = await getAnswers({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {}),
      dbName: this.rootStore.scrapyStore.dbName
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        onlineAnswers: res.data,
        pagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  onlineDb = async payload => {
    const res = await onlineAnswerDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("上线成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  updateLineDb = async payload => {
    const res = await updateLineDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("更新成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  offlineDb = async payload => {
    const res = await offlineAnswerDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("下线成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  deleteLineDb = async payload => {
    const res = await deleteLineDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("线上数据库删除成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  getUsers = async payload => {
    const res = await getUsers({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {})
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        users: res.data,
        userPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  operationUserBlackList = async payload => {
    const { type } = payload;
    const res = await operationUserBlackList(payload).catch(this.handleError);
    if (res && res.data) {
      message.success(
        type === "inspecting"
          ? "设置考察成功"
          : type === "forbidden"
          ? "禁言成功"
          : type === "normal"
          ? "恢复成功"
          : null
      );
      this.dispatch({
        type: "getUsers"
      });
    }
  };
}
