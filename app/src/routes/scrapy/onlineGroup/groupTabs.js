import React, { Component } from "react";
import { Button, Tabs, Divider, Popconfirm, Table } from "antd";
import _ from "lodash";
import { Inject, formatTime } from "../../../utils";
import * as styles from "./groupTabs.module.scss";

const { TabPane } = Tabs;

@Inject(({ onlineStore: model }) => ({
  model
}))
class GroupTabs extends Component {
  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getGroups"
    });
  }

  render() {
    const {
      model: { openModal, groups = [], loading, dispatch }
    } = this.props;

    const sorts = groups
      .sort((a, b) => a.index - b.index)
      .reduce((sum, next) => {
        if (!sum[next.type]) {
          sum[next.type] = [];
        }
        sum[next.type].push(next);
        return sum;
      }, {});

    const columns = [
      {
        title: "排序index",
        dataIndex: "index",
        key: "index"
      },
      {
        title: "avatar",
        dataIndex: "avatar",
        key: "avatar",
        render: v => <img width={100} height={100} src={v} />
      },
      {
        title: "title",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "desc",
        dataIndex: "desc",
        key: "desc"
      },
      {
        title: "createTime",
        dataIndex: "createTime",
        key: "createTime",
        render: v => formatTime(v)
      },
      {
        title: "updateTime",
        dataIndex: "updateTime",
        key: "updateTime",
        render: v => formatTime(v)
      },
      {
        title: "operation",
        dataIndex: "operation",
        key: "operation",
        render: (v, record) => (
          <div>
            <a
              onClick={() => {
                openModal({
                  name: "OperationGroupModal",
                  data: {
                    action: "edit",
                    ...record
                  }
                });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                dispatch({
                  type: "operationGroup",
                  payload: {
                    action: "delete",
                    id: record._id
                  }
                });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Button
            type="primary"
            onClick={() => {
              openModal({
                name: "OperationGroupModal",
                data: {
                  action: "add"
                }
              });
            }}
          >
            添加
          </Button>
        </div>
        <Tabs defaultActiveKey="1" tabPosition="top" className={styles.tabs}>
          {_.keys(sorts).map(item => (
            <TabPane tab={`${item}(${sorts[item].length})`} key={item}>
              <Table
                loading={loading.getGroups}
                key={item}
                pagination={false}
                rowKey={"_id"}
                columns={columns}
                dataSource={sorts[item]}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default GroupTabs;
