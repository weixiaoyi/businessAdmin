import Home from "../home";
import Scrapy from "../scrapy";
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
  }
];
