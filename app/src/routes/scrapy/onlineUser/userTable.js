import React, { Component } from "react";
import { Button, Table, Divider, Popconfirm, Form, Input } from "antd";
import _ from "lodash";
import { Inject } from "../../../utils";
import { TableSearch } from "../../components";
import { TimeBefore } from "../../../components";
import * as styles from "./userTable.module.scss";

const { Search } = Input;

@Form.create()
@Inject(({ onlineStore: model }) => ({
  model
}))
class UserTable extends TableSearch {
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

  search = ({ id, name }) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getUsers",
      payload: {
        id,
        name
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
        key: "_id",
        ...this.getColumnSearchProps("online")
      },
      {
        title: "domain",
        dataIndex: "domain",
        key: "domain",
        ...this.getColumnSearchProps("domain")
      },
      {
        title: "name",
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name")
      },
      {
        title: "createTime",
        dataIndex: "createTime",
        key: "createTime",
        render: v => <TimeBefore time={v} />
      },

      {
        title: "状态",
        dataIndex: "popUserBlackList",
        key: "popUserBlackList",
        render: (undefiend, record) => {
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
        fixed: "right",
        render: (v, record) => (
          <div style={{ paddingLeft: 10 }}>
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
      <div>
        <Form layout="inline" style={{ marginBottom: 20 }}>
          <Form.Item>
            <Search
              allowClear
              placeholder="id"
              enterButton="搜索"
              size="large"
              onSearch={value => this.search({ id: value })}
            />
          </Form.Item>
          <Form.Item>
            <Search
              allowClear
              placeholder="name"
              enterButton="搜索"
              size="large"
              onSearch={value => this.search({ name: value })}
            />
          </Form.Item>
        </Form>
        <Table
          scroll={{ x: 800 }}
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
      </div>
    );
  }
}

export default UserTable;
