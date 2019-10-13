import React, { Component } from "react";
import { Button, Table, Divider, Popconfirm } from "antd";
import _ from "lodash";
import { Inject, formatTime } from "../../../utils";
import * as styles from "./blackUserTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class BlackUserTable extends Component {
  componentDidMount() {
    this.getBlackUsers();
  }

  getBlackUsers = (page, pageSize) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getBlackUsers",
      payload: {
        page,
        pageSize
      }
    });
  };

  render() {
    const {
      model: { blackUsers, blackUsersPagination, loading }
    } = this.props;
    const columns = [
      {
        title: "accountId",
        dataIndex: "accountId",
        key: "accountId"
      },
      {
        title: "domain",
        dataIndex: "domain",
        key: "domain",
        render: (v, record) => _.get(record, "popUser.domain")
      },
      {
        title: "name",
        dataIndex: "name",
        key: "name",
        render: (v, record) => _.get(record, "popUser.name")
      },
      {
        title: "updateTime",
        dataIndex: "updateTime",
        key: "updateTime",
        render: v => formatTime(v)
      },

      {
        title: "状态",
        dataIndex: "type",
        key: "type",
        render: (v, record) => {
          return (
            <div>
              {v === "normal" ? (
                <span className={styles.normal}>
                  正常 ({_.get(record, "normalTimes")})
                </span>
              ) : v === "inspecting" ? (
                <span className={styles.inspecting}>
                  考察中 ({_.get(record, "inspectTimes")})
                </span>
              ) : v === "forbidden" ? (
                <span className={styles.forbidden}>
                  禁言中 ({_.get(record, "forbiddenTimes")})
                </span>
              ) : null}
            </div>
          );
        }
      },
      {
        title: "黑名单记录",
        dataIndex: "history",
        key: "history",
        render: (v, record) => {
          return (
            <div>
              <span>审查次数：{record.inspectTimes}</span>
              <Divider type="vertical" />
              <span>禁言次数：{record.forbiddenTimes}</span>
            </div>
          );
        }
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
          ...blackUsersPagination
        }}
        columns={columns}
        dataSource={blackUsers}
      />
    );
  }
}

export default BlackUserTable;
