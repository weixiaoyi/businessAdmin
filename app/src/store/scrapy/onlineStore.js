import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification } from "antd";
import { getAnswers, getOnlineDbs } from "../../services";

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
  @observable onlineDbs = [];
  @observable dbPagination = {
    pageSize: 100,
    current: 1,
    total: 0
  };

  getOnlineDbs = async payload => {
    const res = await getOnlineDbs({
      page: this.dbPagination.current,
      pageSize: this.dbPagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {}),
      dbName: this.rootStore.scrapyStore.dbName
    });
    console.log(res, "--res");
    // if (res && res.data) {
    //   this.commit({
    //     onlineAnswers: res.data,
    //     pagination: {
    //       current: res.current,
    //       pageSize: res.pageSize,
    //       total: res.total
    //     }
    //   });
    // }
  };

  getAnswers = async payload => {
    const res = await getAnswers({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {}),
      dbName: this.rootStore.scrapyStore.dbName
    });
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
}
