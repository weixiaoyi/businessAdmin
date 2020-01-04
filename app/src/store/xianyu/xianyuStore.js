import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification, message } from "antd";

export default class XianyuStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.listenIpc();
  }
  @observable answers = [];

  listenIpc = () => {
    window.ipc &&
      window.ipc.on("xianyu.test", (e, args) => {
        console.log(args, "---闲鱼");
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
