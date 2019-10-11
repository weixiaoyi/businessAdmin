import React, { Component } from "react";
import { Button, Table, Divider, Icon, Popconfirm } from "antd";
import _ from "lodash";
import { Inject } from "../../../utils";
import * as styles from "./dbTable.module.scss";

@Inject(({ onlineStore: model, scrapyStore }) => ({
  model,
  scrapyStore
}))
class DbTable extends Component {
  state = {
    selectOne: {}
  };
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
      model: { dispatch, localDbs, dbPagination },
      scrapyStore: { dbName }
    } = this.props;
    const { selectOne } = this.state;
    const columns = [
      {
        title: "数据库名称（对内）",
        dataIndex: "name",
        key: "name",
        render: (v, record) => (
          <a
            onClick={() => {
              this.setState({
                selectOne: record
              });
            }}
          >
            {v}
          </a>
        )
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
        title: "服务端操作 ",
        dataIndex: "operation",
        key: "operation",
        render: (v, record) => (
          <div>
            {record.online !== "on" && (
              <Popconfirm
                title="确认上线?"
                onConfirm={() => {
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
                <a>上线</a>
                <Divider type="vertical" />
              </Popconfirm>
            )}
            {record.online === "on" && (
              <Popconfirm
                title="确认下线?"
                onConfirm={() => {
                  dispatch({
                    type: "offlineDb",
                    payload: {
                      name: record.name
                    }
                  });
                }}
              >
                <a>下线</a>
                <Divider type="vertical" />
              </Popconfirm>
            )}

            {(record.online === "on" || record.online === "off") &&
              record.onlineData &&
              (record.name !== _.get(record, "onlineData.name") ||
                record.desc !== _.get(record, "onlineData.desc") ||
                record.title !== _.get(record, "onlineData.title") ||
                record.intro !== _.get(record, "onlineData.intro") ||
                record.member.limit !==
                  _.get(record, "onlineData.member.limit") ||
                record.member.price !==
                  _.get(record, "onlineData.member.price")) && (
                <Popconfirm
                  title="确认更新线上数据库?"
                  onConfirm={() => {
                    dispatch({
                      type: "updateLineDb",
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
                  <a>
                    <span>更新</span>
                  </a>
                  <Divider type="vertical" />
                </Popconfirm>
              )}

            {(record.online === "on" || record.online === "off") && (
              <Popconfirm
                title="确认删除?"
                onConfirm={() => {
                  dispatch({
                    type: "deleteLineDb",
                    payload: {
                      name: record.name
                    }
                  });
                }}
              >
                <a>删除</a>
              </Popconfirm>
            )}
          </div>
        )
      }
    ];

    return (
      <div>
        <Table
          rowClassName={record =>
            record.name === dbName ? styles.currentDb : null
          }
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
        <ul className={styles.info}>
          <li>
            <span>数据库名称：</span>
            {selectOne.name}
          </li>
          <li>
            <span>简短描述（对内）：</span>
            {selectOne.desc}
          </li>
          <li>
            <span>title（对外）：</span>
            {selectOne.title}
          </li>
          <li>
            <span>intro（对外）：</span>
            {selectOne.intro}
          </li>
          <li>
            <span>limit：</span>
            {selectOne.member && selectOne.member.limit}
          </li>
          <li>
            <span>价格：</span>
            {selectOne.member && selectOne.member.price}
          </li>
        </ul>
      </div>
    );
  }
}

export default DbTable;
