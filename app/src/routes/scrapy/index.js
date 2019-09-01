import React, { Component } from "react";
import { Button } from "antd";
import * as styles from "./index.module.scss";

class Scrapy extends Component {
  render() {
    return (
      <div className={styles.Scrapy}>
        <Button
          type="primary"
          onClick={() => {
            window.ipc &&
              window.ipc.send("create-zhihu-scrapy", {
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

export default Scrapy;
