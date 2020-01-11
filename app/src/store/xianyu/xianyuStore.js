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
  @observable versions = {};
  @observable imagePath = "";
  @observable productUrls = [];

  listenIpc = () => {
    const sortImage = data => data.sort((a, b) => a.index - b.index);
    window.ipc &&
      window.ipc.on("xianyu.test", (e, args) => {
        console.log(args, "---闲鱼");
      });

    window.ipc &&
      window.ipc.on("xianyu.get_productUrls", (e, args) => {
        const { data } = args;
        this.commit("productUrls", data);
      });

    window.ipc &&
      window.ipc.on("xianyu.add_productsUrl", (e, args) => {
        const { data } = args;
        this.commit("productUrls", data);
        notification.success({
          message: "商品Url数据更新了",
          description: `商品Url数据更新了`
        });
      });

    window.ipc &&
      window.ipc.on("xianyu.update_version", (e, args) => {
        const { data } = args;
        this.commit("versions", data);
        notification.success({
          message: "版本数据更新了",
          description: `版本数据更新了`
        });
      });

    window.ipc &&
      window.ipc.on("xianyu.get_versionDb", (e, args) => {
        const { data } = args;
        this.commit("versions", data);
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

  "ipc-get-productUrls" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.get-productUrls"
        }
      });
  };

  "ipc-add-productUrl" = ({ url }) => {
    if (this.productUrls.find(item => item.url === url)) {
      return notification.success({
        message: "url已经存在",
        description: `url已经存在`
      });
    }
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.add-productUrl",
          url
        }
      });
  };

  "ipc-get-versionDb" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.get-versionDb"
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

  "ipc-snap-version" = ({ product }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "xianyu.snap-version",
          product
        }
      });
  };
}
