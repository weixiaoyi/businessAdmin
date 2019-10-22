import React, { Component } from "react";
import { Button, Table } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";
import IdeaCommentTable from "./ideaCommentTable";

@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineComment extends Component {
  render() {
    return (
      <div className={classNames(styles.onlineUser, "page")}>
        <div className={styles.left}>
          <h2>idea-Comment表</h2>
          <IdeaCommentTable />
        </div>
        <div className={styles.right}>
          <h2>answerComment</h2>
        </div>
      </div>
    );
  }
}

export default OnlineComment;
