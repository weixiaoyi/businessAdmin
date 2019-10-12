import React, { Component } from "react";
import { Button, Table } from "antd";
import { Inject } from "../../../utils";
import * as styles from "./answerTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class AnswerTable extends Component {
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
      model: { onlineAnswers, pagination, loading }
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
      },
      {
        title: "作者",
        dataIndex: "authorName",
        key: "authorName"
      },
      {
        title: "原始赞同",
        dataIndex: "prevUpVoteNum",
        key: "prevUpVoteNum"
      },
      {
        title: "数据库名称",
        dataIndex: "dbName",
        key: "dbName"
      },
      {
        title: "是否上线",
        dataIndex: "online",
        key: "online",
        render: v => (
          <div>
            {v === "on" ? (
              <span className={styles.online}>已上线</span>
            ) : v === "off" ? (
              <span className={styles.offline}>已下线</span>
            ) : (
              <span className={styles.waiting}>等待上线</span>
            )}
          </div>
        )
      }
    ];
    return (
      <Table
        loading={loading.getAnswers}
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
    );
  }
}

export default AnswerTable;
