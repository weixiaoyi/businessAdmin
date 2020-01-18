import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification, message } from "antd";
import _ from "lodash";
import { localSave } from "../../utils";

export default class OnlineStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
    this.listenIpc();
    autorun(() => {
      localSave.set("refresh_online", this.refresh);
      localSave.set("updateVersionRecords_online", this.updateVersionRecords);
    });
  }
  @observable products = [];
  @observable images = [];
  @observable versions = {};
  @observable imagePath = "";
  @observable productUrls = [];
  @observable selectProductId = "";
  @observable refresh = localSave.get("refresh_online") || false;
  @observable updateVersionRecords =
    localSave.get("updateVersionRecords_online") || [];

  @computed get normalizedProductUrls() {
    const productUrls = this.productUrls.map(item => {
      const findOne =
        this.products.find(one => one.productId === item.productId) || {};
      return {
        ...item,
        ...findOne
      };
    });
    return productUrls.sort((a, b) => b.createTime - a.createTime);
  }

  @computed get normalizedUpdateVersionRecords() {
    return this.updateVersionRecords.filter(item => {
      return this.productUrls.find(one => one.productId === item.productId);
    });
  }

  listenIpc = () => {
    const sortImage = data => data.sort((a, b) => a.index - b.index);
    window.ipc &&
      window.ipc.on("online.test", (e, args) => {
        console.log(args, "---online电商");
      });

    window.ipc &&
      window.ipc.on("online.get_productUrls", (e, args) => {
        const { data } = args;
        this.commit("productUrls", data);
      });

    window.ipc &&
      window.ipc.on("online.remove_productUrl", (e, args) => {
        const { data } = args;
        if (data) {
          notification.success({
            message: "商品Url删除成功",
            description: `商品Url删除成功`
          });
          this.dispatch({
            type: "ipc-get-productUrls"
          });
        } else {
          notification.error({
            message: "商品Url删除失败",
            description: `商品Url删除失败`
          });
        }
      });

    window.ipc &&
      window.ipc.on("online.add_productsUrl", (e, args) => {
        const { data } = args;
        this.commit("productUrls", data);
        notification.success({
          message: "商品Url数据更新了",
          description: `商品Url数据更新了`
        });
      });

    window.ipc &&
      window.ipc.on("online.update_version", (e, args) => {
        const { data, updateInfo } = args;
        this.commit("versions", data);
        notification.success({
          message: "版本数据更新了",
          description: updateInfo
            ? `productId:${updateInfo.productId};title:${updateInfo.title}`
            : `版本数据更新了`
        });
        if (updateInfo) {
          const records = _.cloneDeep(this.updateVersionRecords);
          records.unshift(updateInfo);
          this.commit("updateVersionRecords", records.slice(0, 10));
        }
      });

    window.ipc &&
      window.ipc.on("online.get_versionDb", (e, args) => {
        const { data } = args;
        this.commit("versions", data);
      });

    window.ipc &&
      window.ipc.on("online.get_imageDb", (e, args) => {
        const { data } = args;
        this.commit("images", sortImage(data));
      });

    window.ipc &&
      window.ipc.on("online.get_imagePath", (e, args) => {
        const { dir } = args;
        this.commit("imagePath", dir);
      });

    window.ipc &&
      window.ipc.on("online.get_product", (e, args) => {
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
      window.ipc.on("online.update-imageDb", (e, args) => {
        const { data } = args;
        this.commit("images", sortImage(data));
        notification.success({
          message: "图片数据更新",
          description: `图片数据更新`
        });
      });

    window.ipc &&
      window.ipc.on("online.download-image", (e, args) => {
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

  "ipc-online-test" = ({}) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.test"
        }
      });
  };

  "ipc-remove-productUrl" = ({ productId }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.remove-productUrl",
          productId
        }
      });
  };

  "ipc-get-productUrls" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.get-productUrls"
        }
      });
  };

  "ipc-add-productUrl" = ({ url, website }) => {
    if (this.productUrls.find(item => item.url === url)) {
      return notification.success({
        message: "url已经存在",
        description: `url已经存在`
      });
    }
    if (url && website) {
      window.ipc &&
        window.ipc.send("ipc", {
          from: "app.wins.main.render",
          data: {
            type: "online.add-productUrl",
            url,
            website
          }
        });
    }
  };

  "ipc-get-versionDb" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.get-versionDb"
        }
      });
  };

  "ipc-get-imagePath" = () => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.get-imagePath"
        }
      });
  };

  "ipc-get-imageDb" = ({}) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.get-imageDb"
        }
      });
  };

  "ipc-download-image" = ({ dataUrl, filename, productId, index }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.download-image",
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
          type: "online.open-productIdPath",
          productId
        }
      });
  };

  "ipc-snap-version" = ({ product }) => {
    window.ipc &&
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.snap-version",
          product
        }
      });
  };

  selectOneProduct = ({ productId }) => {
    this.commit("selectProductId", productId);
  };

  autoRefresh = () => {
    this.commit("refresh", !this.refresh);
    window.location.reload();
  };
}
