import React, { Component } from "react";
import { Button, Table } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";
import AnswerTable from "./answerTable";
import DbTable from "./dbTable";

@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineDb extends Component {
  render() {
    return (
      <div className={classNames(styles.onlineDb, "page")}>
        <div className={styles.left}>
          <h2>当前数据库answer列表</h2>
          <AnswerTable />
        </div>
        <div className={styles.right}>
          <h2>数据库列表</h2>
          <DbTable />
        </div>
      </div>
    );
  }
}

export default OnlineDb;
