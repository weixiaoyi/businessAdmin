import { default as GlobalStore } from "./globalStore";
import { default as ScrapyStore } from "./scrapyStore";
class RootStore {
  constructor() {
    this.globalStore = new GlobalStore(this);
    this.scrapyStore = new ScrapyStore(this);
  }
}

export default new RootStore();
