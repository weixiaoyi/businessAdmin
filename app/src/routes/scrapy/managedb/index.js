import React, { Component } from "react";
import { Button, Card, Divider, Select, Input, Popover } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class ManageDb extends Component {
  render() {
    return (
      <div className={classNames(styles.ManageDb, "page")}>
        <div className={styles.left}></div>
        <div className={styles.right}></div>
      </div>
    );
  }
}

export default ManageDb;
