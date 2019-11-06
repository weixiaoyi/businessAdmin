import React, { Component } from "react";
import { Button, Table, Divider, Popconfirm } from "antd";
import { Inject, formatTime } from "../../../utils";
import { TableSearch } from "../../components";
import { TimeBefore } from "../../../components";
import * as styles from "./ideaTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class IdeaTable extends TableSearch {
  componentDidMount() {
    this.getIdeasPreview();
  }

  getIdeasPreview = (page, pageSize) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getIdeasPreview",
      payload: {
        page,
        pageSize
      }
    });
  };

  render() {
    const {
      model: { ideasPreview, ideasPreviewPagination, loading, dispatch }
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
        title: "标题",
        dataIndex: "title",
        key: "title",
        ...this.getColumnSearchProps("title"),
        render: v => (
          <div style={{ width: 100 }} className={styles.ellipes}>
            {v}
          </div>
        )
      },
      {
        title: "内容",
        dataIndex: "brief",
        key: "brief",
        ...this.getColumnSearchProps("brief"),
        render: v => (
          <div style={{ width: 100 }} className={styles.ellipes}>
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
        render: v => (v ? <TimeBefore time={v} /> : "暂无更新")
      },
      {
        title: "评论与关注",
        dataIndex: "computed",
        key: "computed",
        render: (v, record) => {
          return (
            <div>
              评论数：{record.computedCommentsNum}
              <Divider type="vertical" />
              关注数 ：{record.computedInterestNum}
            </div>
          );
        }
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
        fixed: "right",
        width: 160,
        render: (v, record) => (
          <div style={{ paddingLeft: 10 }}>
            <Popconfirm
              title="确认拒绝?"
              onConfirm={() => {
                dispatch({
                  type: "inspectIdea",
                  payload: {
                    id: record._id,
                    online: "off",
                    denyWhy:
                      "内容不符合规范合法要求，请重新编辑，如有疑问，请联系站点"
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
                  type: "inspectIdea",
                  payload: {
                    id: record._id,
                    online: "on"
                  }
                });
              }}
            >
              <a>通过</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a
              onClick={() => {
                dispatch({
                  type: "getIdeaDetail",
                  payload: {
                    id: record._id
                  }
                });
              }}
            >
              查看详情
            </a>
          </div>
        )
      }
    ];
    return (
      <Table
        scroll={{ x: 800 }}
        expandedRowRender={record => (
          <div>
            <div>
              创建时间：{formatTime(record.createTime)}
              <Divider type="vertical" />
              更新时间：
              {record.updateTime ? formatTime(record.updateTime) : "暂无更新"}
            </div>
            {record.brief}
          </div>
        )}
        rowKey="_id"
        loading={loading.getIdeasPreview}
        onChange={({ current, pageSize }) => {
          this.getIdeasPreview(current, pageSize);
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["1", "10", "20", "50", "100", "1000"],
          ...ideasPreviewPagination
        }}
        columns={columns}
        dataSource={ideasPreview}
      />
    );
  }
}

export default IdeaTable;
