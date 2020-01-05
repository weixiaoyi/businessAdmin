import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification, message } from "antd";
import _ from "lodash";

export default class XianyuStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.listenIpc();
  }
  @observable products = [];

  listenIpc = () => {
    window.ipc &&
      window.ipc.on("xianyu.test", (e, args) => {
        console.log(args, "---闲鱼");
      });
    window.ipc.on("xianyu.get_product", (e, args) => {
      const { data } = args;
      let products = _.cloneDeep(this.products);
      if (products.find(one => one.url === data.url)) {
        products = products.map(item => {
          if (item.url === data.url) {
            return data;
          }
          return item;
        });
      } else {
        products.unshift(data);
      }
      this.commit("products", products);
    });
  };

  "ipc-xianyu-test" = ({}) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.test"
        }
      });
  };
}
