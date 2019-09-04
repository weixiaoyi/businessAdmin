import { observer, inject } from "mobx-react";
import dayjs from "dayjs";

export const Inject = func => {
  return c => {
    return inject(func)(observer(c));
  };
};

export const formatTime = time => dayjs(time).format("YYYY-MM-DD HH:mm:ss");
