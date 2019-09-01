import { autorun, computed, observable } from "mobx";
import ModelExtend from "./modelExtend";

export default class GlobalStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }

  @observable name = "globalStore";
  @observable modal = {
    show: true,
    name: "",
    data: ""
  };
}
