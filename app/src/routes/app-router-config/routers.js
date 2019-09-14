import Home from "../home";
import Scrapy from "../scrapy";
import ScrapyPdf from "../scrapyPdf";
import { PATH } from "../../constants";

export default [
  {
    title: "home",
    component: Home,
    path: PATH.home
  },
  {
    title: "scrapy",
    component: Scrapy,
    path: PATH.scrapy
  },
  {
    title: "ScrapyPdf",
    component: ScrapyPdf,
    path: PATH.scrapyPdf,
    blank: true
  }
];
