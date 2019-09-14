import React, { Component } from "react";
import { Button } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";
import { PATH } from "../../../constants";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class ManageDb extends Component {
  render() {
    const {
      model: { dispatch }
    } = this.props;
    return (
      <div className={classNames(styles.ManageDb, "page")}>
        <div className={styles.left}>
          <Button
            onClick={() => {
              dispatch({
                type: "ipc-create-preview-pdf",
                payload: {
                  url: "http://localhost:3000/blank/scrapy/pdf"
                }
              });
            }}
          >
            预览PDF
          </Button>
          <Button
            onClick={() => {
              dispatch({
                type: "ipc-download-pdf"
              });
            }}
          >
            下载PDF
          </Button>
        </div>
        <div className={styles.right}>456</div>
      </div>
    );
  }
}

export default ManageDb;
