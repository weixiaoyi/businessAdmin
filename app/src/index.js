import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure } from "mobx";
import App from "./routes/app";
import { notification, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import "antd/dist/antd.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { default as store } from "./store";

configure({ enforceActions: "always" });

notification.config({
  duration: 2
});

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider {...store}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
