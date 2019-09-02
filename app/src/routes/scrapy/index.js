import React, { Component } from "react";
import { Button } from "antd";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;

    dispatch({
      type: "ipc-get-scrapy-answers"
    });
  }
  render() {
    const {
      model: { dispatch }
    } = this.props;
    return (
      <div className={styles.Scrapy}>
        <Button
          type="primary"
          onClick={() => {
            dispatch({
              type: "ipc-create-scrapy"
            });
          }}
        >
          创建BrowserWindow
        </Button>
        <div></div>
      </div>
    );
  }
}

export default Scrapy;
