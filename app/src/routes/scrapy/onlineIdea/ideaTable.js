import React, { Component } from "react";
import { Button, Table, Divider, Popconfirm } from "antd";
import { Inject, formatTime } from "../../../utils";
import * as styles from "./ideaTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class IdeaTable extends Component {
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
        render: v => (
          <div style={{ width: 50 }} className={styles.ellipes}>
            {v}
          </div>
        )
      },
      {
        title: "title",
        dataIndex: "title",
        key: "title",
        render: v => (
          <div style={{ width: 100 }} className={styles.ellipes}>
            {v}
          </div>
        )
      },
      {
        title: "brief",
        dataIndex: "brief",
        key: "brief",
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
        render: v => formatTime(v)
      },
      {
        title: "computed",
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
