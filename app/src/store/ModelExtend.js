import { action } from "mobx";
import _ from "lodash";

export default class ModelExtend {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  commit = (k, v, defaultValue = "") => {
    const change = (k, v, defaultValue) => {
      if (k) {
        this[`${k}_prev`] = _.cloneDeep(this[k]);
        _.set(this, `${k}`, v || defaultValue);
      } else {
        console.error("commit参数的k是必须参数");
      }
    };
    if (_.isObject(k)) {
      for (let i in k) {
        if (k.hasOwnProperty(i)) {
          change(i, k[i], defaultValue);
        }
      }
    } else {
      change(k, v, defaultValue);
    }
  };

  dispatch = (payloads = {}) => {
    const checkExistMethod = (storeName, methodName) => {
      console.error(
        `dispatch参数的type是必须参数,并且必须存在${
          storeName ? `${storeName}/${methodName}` : methodName
        }这个方法`
      );
      return Promise.reject(
        new Error("dispatch参数的type是必须参数,并且必须存在这个方法")
      );
    };
    const { type, payload = {} } = payloads;
    const splits = type.split("/");
    let [storeName, methodName] = [];
    let result;
    if (splits[1]) {
      [storeName, methodName] = splits;
      if (
        !this.rootStore[storeName] ||
        !this.rootStore[storeName][methodName]
      ) {
        checkExistMethod(storeName, methodName);
      } else {
        result = this.rootStore[storeName][methodName](payload);
      }
    } else {
      [methodName] = splits;
      if (!methodName || !this[methodName]) {
        checkExistMethod(storeName, methodName);
      } else {
        result = this[methodName](payload);
      }
    }

    if (result && result.then) {
      return result.then(res => {
        return res;
      });
    } else {
      return Promise.resolve(result);
    }
  };

  handleError = err => {
    if (
      _.get(err, "status") === 401 &&
      _.get(err, "data.msg") === "Unauthorized_RequiredLogin"
    ) {
    } else if (_.get(err, "data.msg")) {
    } else if (_.get(err, "errMsg")) {
    } else {
    }
    return false;
  };

  setLoading = (loadingName, loadingStatus) => {
    this.commit(loadingName, loadingStatus);
  };

  openModal = (payload = {}) => {
    this.commit("rootStore.globalStore.modal", {
      show: true,
      ...payload
    });
  };

  closeModal = () => {
    this.commit("rootStore.globalStore.modal", {
      show: false,
      name: "",
      data: ""
    });
  };
}
