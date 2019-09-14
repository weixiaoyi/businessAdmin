import { default as GlobalStore } from "./globalStore";
import { default as ScrapyStore } from "./scrapy/scrapyStore";
import { default as ScrapyPdfStore } from "./scrapy/scrapyPdfStore";
class RootStore {
  constructor() {
    this.globalStore = new GlobalStore(this);
    this.scrapyStore = new ScrapyStore(this);
    this.scrapyPdfStore = new ScrapyPdfStore(this);
  }
}

export default new RootStore();
