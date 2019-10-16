import React, { Component } from "react";
import { Button, Table } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";
import GroupTabs from "./groupTabs";
import OperationGroupModal from "./operationGroupModal";

@Inject(({ onlineStore: model, globalStore }) => ({
  model,
  globalStore
}))
class OnlineGroup extends Component {
  render() {
    const {
      globalStore: {
        modal: { name }
      }
    } = this.props;
    return (
      <div className={classNames(styles.onlineGroup, "page")}>
        <div className={styles.left}>
          <h2>group副业圈</h2>
          <GroupTabs />
        </div>
        <div className={styles.right}>
          <h2>暂定</h2>
        </div>
        {name === "OperationGroupModal" && <OperationGroupModal />}
      </div>
    );
  }
}

export default OnlineGroup;
