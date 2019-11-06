import React, { Component } from "react";
import { Button, Table, Divider, Popconfirm } from "antd";
import { Inject, formatTime } from "../../../utils";
import { TableSearch } from "../../components";
import { TimeBefore } from "../../../components";
import * as styles from "./ideaCommentTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class IdeaCommentTable extends TableSearch {
  componentDidMount() {
    this.getIdeasComment();
  }

  getIdeasComment = (page, pageSize) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getIdeasComment",
      payload: {
        page,
        pageSize
      }
    });
  };

  render() {
    const {
      model: { ideasComment, ideasCommentPagination, loading, dispatch }
    } = this.props;
    const columns = [
      {
        title: "_id",
        dataIndex: "_id",
        key: "_id",
        ...this.getColumnSearchProps("_id"),
        render: v => (
          <div style={{ width: 50 }} className={styles.ellipes}>
            {v}
          </div>
        )
      },
      {
        title: "评论者",
        dataIndex: "popUser",
        key: "popUser",
        render: v => <div>{v.name}</div>
      },
      {
        title: "回复对象",
        dataIndex: "popToUser",
        key: "popToUser",
        render: v => <div>{v ? v.name : "暂无"}</div>
      },
      {
        title: "comment",
        dataIndex: "comment",
        key: "comment",
        ...this.getColumnSearchProps("comment"),
        render: v => (
          <div style={{ width: 100 }} className={styles.ellipes}>
            {v}
          </div>
        )
      },
      {
        title: "createTime",
        dataIndex: "createTime",
        key: "createTime",
        render: v => <TimeBefore time={v} />
      },
      {
        title: "状态",
        dataIndex: "online",
        key: "online",
        ...this.getColumnSearchProps("online"),
        render: (v, record) => {
          return v === "on" ? (
            <span className={styles.on}>{v}</span>
          ) : record.denyWhy ? (
            <span className={styles.deny}>已拒绝</span>
          ) : (
            <span className={styles.off}>{v}</span>
          );
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (v, record) => (
          <div>
            <Popconfirm
              title="确认拒绝?"
              onConfirm={() => {
                dispatch({
                  type: "inspectIdeaComment",
                  payload: {
                    id: record._id,
                    online: "off"
                  }
                });
              }}
            >
              <a>拒绝</a>
            </Popconfirm>

            <Divider type="vertical" />
            <Popconfirm
              title="确认通过"
              onConfirm={() => {
                dispatch({
                  type: "inspectIdeaComment",
                  payload: {
                    id: record._id,
                    online: "on"
                  }
                });
              }}
            >
              <a>通过</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    return (
      <Table
        scroll={{ x: 800 }}
        expandedRowRender={record => (
          <div>
            <div>创建时间：{formatTime(record.createTime)}</div>
            {record.comment}
          </div>
        )}
        rowKey="_id"
        loading={loading.getIdeasComment}
        onChange={({ current, pageSize }) => {
          this.getIdeasComment(current, pageSize);
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["1", "10", "20", "50", "100", "1000"],
          ...ideasCommentPagination
        }}
        columns={columns}
        dataSource={ideasComment}
      />
    );
  }
}

export default IdeaCommentTable;
