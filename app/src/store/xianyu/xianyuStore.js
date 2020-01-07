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
  @observable images = [];
  @observable imagePath = "";

  listenIpc = () => {
    const sortImage = data => data.sort((a, b) => a.index - b.index);
    window.ipc &&
      window.ipc.on("xianyu.test", (e, args) => {
        console.log(args, "---闲鱼");
      });

    window.ipc &&
      window.ipc.on("xianyu.get_imageDb", (e, args) => {
        const { data } = args;
        this.commit("images", sortImage(data));
      });

    window.ipc &&
      window.ipc.on("xianyu.get_imagePath", (e, args) => {
        const { dir } = args;
        this.commit("imagePath", dir);
      });

    window.ipc &&
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

    window.ipc &&
      window.ipc.on("xianyu.update-imageDb", (e, args) => {
        const { data } = args;
        this.commit("images", sortImage(data));
        notification.success({
          message: "图片数据更新",
          description: `图片数据更新`
        });
      });

    window.ipc &&
      window.ipc.on("xianyu.download-image", (e, args) => {
        if (args) {
          if (args) {
            notification.success({
              message: "图片下载成功",
              description: `${args}下载成功`
            });
          } else {
            notification.error({
              message: "下载失败",
              description: `图片下载失败`
            });
          }
        }
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

  "ipc-get-imagePath" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.get-imagePath"
        }
      });
  };

  "ipc-get-imageDb" = ({}) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.get-imageDb"
        }
      });
  };

  "ipc-download-image" = ({ dataUrl, filename, productId, index }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.download-image",
          dataUrl,
          filename,
          productId,
          index
        }
      });
  };

  "ipc-open-productIdPath" = ({ productId }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.open-productIdPath",
          productId
        }
      });
  };
}
