import React, { Component } from "react";
import { Button, Table } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";
import IdeaTable from "./ideaTable";

@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineIdea extends Component {
  render() {
    return (
      <div className={classNames(styles.onlineUser, "page")}>
        <div className={styles.left}>
          <h2>idea表</h2>
          <IdeaTable />
        </div>
        <div className={styles.right}>
          <h2>暂定</h2>
        </div>
      </div>
    );
  }
}

export default OnlineIdea;
