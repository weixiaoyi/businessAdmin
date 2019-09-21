import { observer, inject } from "mobx-react";
import dayjs from "dayjs";
import store from "store";
import queryString from "query-string";

export const Inject = func => {
  return c => {
    return inject(func)(observer(c));
  };
};

export const formatTime = time => dayjs(time).format("YYYY-MM-DD HH:mm:ss");

export const localSave = {
  get: (key, defaultValue) => {
    return store.get(key) || defaultValue;
  },
  set: (key, value) => {
    store.set(key, value);
  },
  remove: key => {
    store.remove(key);
  },
  clearAll: () => {
    store.clearAll();
  }
};

export const parseString = search => queryString.parse(search);
