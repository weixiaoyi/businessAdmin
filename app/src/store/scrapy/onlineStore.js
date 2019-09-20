import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification } from "antd";

export default class OnlineStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }
  @observable onlineAnswers = [];
}
