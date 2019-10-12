import React, { Component } from "react";
import { Button, Table, Divider } from "antd";
import { Inject } from "../../../utils";
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
        render: v => v.toString()
      },

      {
        title: "状态",
        dataIndex: "type",
        key: "type",
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
          <div>
            <a
              onClick={() => {
                dispatch({
                  type: "operationUserBlackList",
                  payload: {
                    accountId: record._id,
                    type: "normal"
                  }
                });
              }}
            >
              恢复正常
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                dispatch({
                  type: "operationUserBlackList",
                  payload: {
                    accountId: record._id,
                    type: "inspecting"
                  }
                });
              }}
            >
              考察
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                dispatch({
                  type: "operationUserBlackList",
                  payload: {
                    accountId: record._id,
                    type: "forbidden"
                  }
                });
              }}
            >
              禁言
            </a>
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
