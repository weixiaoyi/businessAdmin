import { autorun, computed, observable } from "mobx";
import MdelExtend from "./modelExtend";

export default class GlobalStore extends MdelExtend {
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
