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
export const formatMonthTime = time => dayjs(time).format("MM/DD HH:mm:ss");

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

export const parseImage = (content, dbName, appPath) =>
  window.ipc && content
    ? content.replace(
        /src="http:\/\/(.*?)\.jpg"/g,
        window.path.join(
          "src=file://",
          appPath,
          dbName,
          `${"$1"}.jpg?filename=${"$1"}.jpg`
        )
      )
    : content;

export const getFilename = src => src.replace(/.*\/(.*)\.jpg|png/g, "$1");
