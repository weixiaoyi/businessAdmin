import React, { Component } from "react";
import { Button } from "antd";
import * as styles from "./index.module.scss";

class Home extends Component {
  render() {
    return (
      <div className={styles.home}>
        <Button
          type="primary"
          onClick={() => {
            window.ipc &&
              window.ipc.send("createBrowser", {
                url: "http://zhihu.com"
              });
          }}
        >
          创建BrowserWindow
        </Button>
      </div>
    );
  }
}

export default Home;
