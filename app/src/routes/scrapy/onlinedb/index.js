import React, { Component } from "react";
import { Button, Table } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import * as styles from "./index.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineDb extends Component {
  componentDidMount() {
    this.getAnswers();
  }

  getAnswers = (page, pageSize) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getAnswers",
      payload: {
        page,
        pageSize
      }
    });
  };

  render() {
    const {
      model: { onlineAnswers, pagination }
    } = this.props;
    const columns = [
      {
        title: "id",
        dataIndex: "answerId",
        key: "answerId"
      },
      {
        title: "content",
        dataIndex: "content",
        key: "content",
        render: v => (
          <div style={{ width: 180 }} className={styles.answerContent}>
            {v}
          </div>
        )
      }
    ];
    return (
      <div className={classNames(styles.onlineDb, "page")}>
        <div className={styles.left}>
          <Table
            onChange={({ current, pageSize }) => {
              this.getAnswers(current, pageSize);
            }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["1", "10", "20", "50", "100", "1000"],
              ...pagination
            }}
            rowKey={"answerId"}
            columns={columns}
            dataSource={onlineAnswers}
          />
        </div>
        <div className={styles.right}>jie</div>
      </div>
    );
  }
}

export default OnlineDb;
