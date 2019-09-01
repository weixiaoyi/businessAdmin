import { default as GlobalStore } from "./globalStore";
class RootStore {
  constructor() {
    this.globalStore = new GlobalStore(this);
  }
}

export default new RootStore();
