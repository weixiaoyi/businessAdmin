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

  getAnswers = async () => {
    const res = await getAnswers();
    console.log(res, "-----res");
  };
}
