import React, { Component } from "react";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";
import { Webview, DragFix } from "../../components";
import injectJavaScript from "./injectJavaScript";

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
  }

  render() {
    return (
      <div className={styles.xianyu}>
        咸鱼
        <DragFix name="xianyu" />
        <div>
          <Webview
            executeJavaScript={injectJavaScript}
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
