import { observer, inject } from "mobx-react";
export const Inject = func => {
  return c => {
    return inject(func)(observer(c));
  };
};
