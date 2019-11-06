import React, { Component } from "react";
import { Button, Table, Divider, Popconfirm, Rate } from "antd";
import { formatTime, Inject } from "../../../utils";
import { TimeBefore } from "../../../components";
import { TableSearch } from "../../components";
import * as styles from "./answerTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class AnswerTable extends TableSearch {
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
      model: { dispatch, onlineAnswers, pagination, loading }
    } = this.props;
    const columns = [
      {
        title: "id",
        dataIndex: "answerId",
        key: "answerId",
        ...this.getColumnSearchProps("answerId"),
        render: v => (
          <div style={{ width: 50 }} className={styles.answerContent}>
            {v}
          </div>
        )
      },
      {
        title: "content",
        dataIndex: "content",
        key: "content",
        ...this.getColumnSearchProps("content"),
        render: v => (
          <div style={{ width: 80 }} className={styles.answerContent}>
            {v}
          </div>
        )
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
        render: v => <TimeBefore time={v} />
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        key: "updateTime",
        render: v => v && <TimeBefore time={v} />
      },
      {
        title: "原始赞同/当前",
        dataIndex: "prevUpVoteNum",
        key: "prevUpVoteNum",
        render: (v, record) => `${v}/${record.currentUpVoteNum}`
      },
      {
        title: "推荐指数",
        dataIndex: "index",
        key: "index"
      },
      {
        title: "是否上线",
        dataIndex: "online",
        key: "online",
        ...this.getColumnSearchProps("online"),
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
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (v, record) => (
          <Popconfirm
            title="确认删除"
            onConfirm={() => {
              dispatch({
                type: "deleteLineAnswer",
                payload: {
                  answerId: record.answerId
                }
              });
            }}
          >
            <a>删除</a>
          </Popconfirm>
        )
      }
    ];
    return (
      <Table
        expandedRowRender={record => (
          <div>
            <div>
              作者：{record.authorName}
              <Divider type="vertical" />
              创建时间:{formatTime(record.createTime)}
              <Divider type="vertical" />
              推荐指数：
              <Rate
                count={10}
                allowClear
                allowHalf
                value={record.index}
                style={{ fontSize: 16 }}
                onChange={v =>
                  dispatch({
                    type: "recommendLineAnswer",
                    payload: {
                      answerId: record.answerId,
                      index: v
                    }
                  })
                }
              />
            </div>
            <div>{record.content}</div>
          </div>
        )}
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
        scroll={{ x: 800 }}
      />
    );
  }
}

export default AnswerTable;
