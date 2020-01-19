import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure } from "mobx";
import App from "./routes/app";
import moment from "moment";
import "moment/locale/zh-cn";
import { notification, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import "antd/dist/antd.css";
import "swiper/css/swiper.css";
import "rc-slider/assets/index.css";
import "viewerjs/dist/viewer.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { default as store } from "./store";

moment.locale("zh-cn");

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
