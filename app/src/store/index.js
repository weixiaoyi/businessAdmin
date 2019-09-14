import { default as GlobalStore } from "./globalStore";
import { default as ScrapyStore } from "./scrapy/scrapyStore";
import { default as ScrapyManageDbStore } from "./scrapy/scrapyManageDbStore";
class RootStore {
  constructor() {
    this.globalStore = new GlobalStore(this);
    this.scrapyStore = new ScrapyStore(this);
    this.scrapyManageDbStore = new ScrapyManageDbStore(this);
  }
}

export default new RootStore();
