import React, { Component } from "react";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";
import { Webview } from "../../components";

@Inject(({ xianyuStore: model }) => ({
  model
}))
class XianYu extends Component {
  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-xianyu-test"
    });
    const webview = document.querySelector("webview");
    webview.addEventListener("dom-ready", () => {
      // webview.openDevTools();
    });
  }

  render() {
    return (
      <div className={styles.xianyu}>
        咸鱼
        <div>
          <Webview
            style={{ height: 1000 }}
            src={
              "https://2.taobao.com/item.htm?spm=2007.1000261.0.0.6f1834f16hrC3I&id=604685713430"
            }
          />
        </div>
      </div>
    );
  }
}

export default XianYu;
