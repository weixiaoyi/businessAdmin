import React, { Component } from "react";
import { Button, Table } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";
import UserTable from "./userTable";

@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineUser extends Component {
  render() {
    return (
      <div className={classNames(styles.onlineUser, "page")}>
        <div className={styles.left}>
          <h2>user数据表用户</h2>
          <UserTable />
        </div>
        <div className={styles.right}>
          <h2>暂定</h2>
        </div>
      </div>
    );
  }
}

export default OnlineUser;
