import { default as GlobalStore } from "./globalStore";
import { default as ScrapyStore } from "./scrapy/scrapyStore";
import { default as PdfStore } from "./scrapy/pdfStore";
import { default as OnlineStore } from "./scrapy/onlineStore";
import { default as XianyuStore } from "./xianyu/xianyuStore";
class RootStore {
  constructor() {
    this.globalStore = new GlobalStore(this);
    this.scrapyStore = new ScrapyStore(this);
    this.pdfStore = new PdfStore(this);
    this.onlineStore = new OnlineStore(this);
    this.xianyuStore = new XianyuStore(this);
  }
}

export default new RootStore();
