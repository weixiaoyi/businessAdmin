import React, { Component } from "react";
import { Button, Table, Divider, Popconfirm } from "antd";
import _ from "lodash";
import { Inject, formatTime } from "../../../utils";
import * as styles from "./userTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class UserTable extends Component {
  componentDidMount() {
    this.getUsers();
  }

  getUsers = (page, pageSize) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getUsers",
      payload: {
        page,
        pageSize
      }
    });
  };

  render() {
    const {
      model: { users, userPagination, loading, dispatch }
    } = this.props;
    const columns = [
      {
        title: "_id",
        dataIndex: "_id",
        key: "_id"
      },
      {
        title: "domain",
        dataIndex: "domain",
        key: "domain"
      },
      {
        title: "name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "createTime",
        dataIndex: "createTime",
        key: "createTime",
        render: v => formatTime(v)
      },

      {
        title: "状态",
        dataIndex: "popUserBlackList",
        key: "popUserBlackList",
        render: (undefied, record) => {
          const v = _.get(record, "popUserBlackList.type");
          return (
            <div>
              {v === "normal" ? (
                <span className={styles.normal}>正常</span>
              ) : v === "inspecting" ? (
                <span className={styles.inspecting}>考察中</span>
              ) : v === "forbidden" ? (
                <span className={styles.forbidden}>禁言中</span>
              ) : (
                <span className={styles.normal}>无记录</span>
              )}
            </div>
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
              title="确认考察?"
              onConfirm={() => {
                dispatch({
                  type: "operationUserBlackList",
                  payload: {
                    accountId: record._id,
                    type: "normal"
                  }
                });
              }}
            >
              <a>恢复正常 ({_.get(record, "popUserBlackList.normalTimes")})</a>
            </Popconfirm>

            <Divider type="vertical" />
            <Popconfirm
              title="确认考察?"
              onConfirm={() => {
                dispatch({
                  type: "operationUserBlackList",
                  payload: {
                    accountId: record._id,
                    type: "inspecting"
                  }
                });
              }}
            >
              <a>考察 ({_.get(record, "popUserBlackList.inspectTimes")})</a>
            </Popconfirm>

            <Divider type="vertical" />
            <Popconfirm
              title="确认禁言?"
              onConfirm={() => {
                dispatch({
                  type: "operationUserBlackList",
                  payload: {
                    accountId: record._id,
                    type: "forbidden"
                  }
                });
              }}
            >
              <a>禁言 ({_.get(record, "popUserBlackList.forbiddenTimes")})</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    return (
      <Table
        rowKey="_id"
        loading={loading.getUsers}
        onChange={({ current, pageSize }) => {
          this.getUsers(current, pageSize);
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["1", "10", "20", "50", "100", "1000"],
          ...userPagination
        }}
        columns={columns}
        dataSource={users}
      />
    );
  }
}

export default UserTable;
