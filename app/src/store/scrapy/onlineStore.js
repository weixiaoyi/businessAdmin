import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification } from "antd";
import { getAnswers } from "../../services";

export default class OnlineStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }
  @observable onlineAnswers = [];
  @observable pagination = {
    pageSize: 10,
    current: 1,
    total: 0
  };

  getAnswers = async payload => {
    const res = await getAnswers({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {})
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
