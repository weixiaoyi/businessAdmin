import { autorun, computed, observable } from "mobx";
import ModelExtend from "./modelExtend";

export default class GlobalStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.listenIpc();
  }

  @observable name = "globalStore";
  @observable modal = {
    show: true,
    name: "",
    data: ""
  };
  @observable globalConfigs = {};

  listenIpc = () => {
    window.ipc &&
      window.ipc.on("global.config", (e, args) => {
        const { preloadJsPath } = args;
        this.commit("globalConfigs", {
          status: true,
          preloadJsPath
        });
      });
  };

  "ipc-globalConfig" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "global.config"
        }
      });
  };
}
