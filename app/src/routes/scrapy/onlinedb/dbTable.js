import React, { Component } from "react";
import { Button, Table, Divider, Icon } from "antd";
import _ from "lodash";
import { Inject } from "../../../utils";
import * as styles from "./dbTable.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class DbTable extends Component {
  componentDidMount() {
    this.getOnlineDbs();
  }

  getOnlineDbs = (page, pageSize) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "getOnlineDbs",
      payload: {
        page,
        pageSize
      }
    });
  };

  render() {
    const {
      model: { dispatch, localDbs, dbPagination }
    } = this.props;
    const columns = [
      {
        title: "数据库名称（对内）",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "简短描述（对内）",
        dataIndex: "desc",
        key: "desc"
      },
      {
        title: "title(对外)",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "intro(对外)",
        dataIndex: "intro",
        key: "intro"
      },
      {
        title: "limit",
        dataIndex: "limit",
        key: "limit",
        render: (v, record) => record.member && record.member.limit
      },
      {
        title: "价格",
        dataIndex: "price",
        key: "price",
        render: (v, record) => record.member && record.member.price
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
            ) : v === "waiting" ? (
              <span className={styles.waiting}>等待上线</span>
            ) : (
              <Icon type="loading" />
            )}
          </div>
        )
      },
      {
        title: "操作 ",
        dataIndex: "operation",
        key: "operation",
        render: (v, record) => (
          <div>
            <a
              onClick={() => {
                dispatch({
                  type: "onlineDb",
                  payload: {
                    name: record.name,
                    desc: record.desc,
                    title: record.title,
                    intro: record.intro,
                    member: {
                      limit: record.member.limit,
                      price: record.member.price
                    }
                  }
                });
              }}
            >
              上线
            </a>
            <Divider type="vertical" />
            <a onClick={() => {}}>下线</a>
            <Divider type="vertical" />
            <a onClick={() => {}}>
              {record.onlineData &&
                (record.name !== _.get(record, "onlineData.name") ||
                  record.desc !== _.get(record, "onlineData.desc") ||
                  record.title !== _.get(record, "onlineData.title") ||
                  record.intro !== _.get(record, "onlineData.intro") ||
                  record.member.limit !==
                    _.get(record, "onlineData.member.limit") ||
                  record.member.price !==
                    _.get(record, "onlineData.member.price")) && (
                  <span>
                    更新
                    <Divider type="vertical" />
                  </span>
                )}
            </a>

            <a onClick={() => {}}>删除</a>
            <Divider type="vertical" />
          </div>
        )
      }
    ];
    return (
      <div>
        <Table
          scroll={{ x: 800 }}
          onChange={({ current, pageSize }) => {
            this.getOnlineDbs(current, pageSize);
          }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["50", "100", "1000"],
            ...dbPagination
          }}
          rowKey={"name"}
          columns={columns}
          dataSource={localDbs}
        />
        <ul>
          <li>hahha</li>
        </ul>
      </div>
    );
  }
}

export default DbTable;
