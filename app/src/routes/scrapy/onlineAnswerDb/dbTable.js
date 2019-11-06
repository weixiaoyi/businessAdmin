import React, { Component } from "react";
import {
  Button,
  Table,
  Divider,
  Icon,
  Popconfirm,
  InputNumber,
  Form,
  Input
} from "antd";
import _ from "lodash";
import { Inject } from "../../../utils";
import * as styles from "./dbTable.module.scss";

@Form.create()
@Inject(({ onlineStore: model, scrapyStore }) => ({
  model,
  scrapyStore
}))
class DbTable extends Component {
  state = {
    expandedRowKeys: []
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

  handleSubmit = (e, record) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          model: { dispatch }
        } = this.props;
        const { name, desc } = record;
        dispatch({
          type: "updateLineDb",
          payload: {
            name,
            desc,
            title: values.title,
            intro: values.intro,
            member: {
              limit: values.limit,
              price: values.price
            }
          }
        });
      }
    });
  };

  render() {
    const {
      model: { dispatch, localDbs, dbPagination, loading },
      scrapyStore: { dbName }
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
        key: "title",
        render: (v, record) => (
          <div style={{ width: 80 }} className={styles.limitContent}>
            {_.get(record, "onlineData.title")}
          </div>
        )
      },
      {
        title: "intro(对外)",
        dataIndex: "intro",
        key: "intro",
        render: (v, record) => (
          <div style={{ width: 80 }} className={styles.limitContent}>
            {_.get(record, "onlineData.intro")}
          </div>
        )
      },
      {
        title: "limit",
        dataIndex: "limit",
        key: "limit",
        render: (v, record) => _.get(record, "onlineData.member.limit")
      },
      {
        title: "价格",
        dataIndex: "price",
        key: "price",
        render: (v, record) => _.get(record, "onlineData.member.price")
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
                      name: _.get(record, "onlineData.name"),
                      desc: _.get(record, "onlineData.desc"),
                      title: _.get(record, "onlineData.title"),
                      intro: _.get(record, "onlineData.intro"),
                      member: {
                        limit: _.get(record, "onlineData.member.limit"),
                        price: _.get(record, "onlineData.member.price")
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

    const { getFieldDecorator } = this.props.form;
    const { expandedRowKeys } = this.state;

    return (
      <div>
        <Table
          expandedRowKeys={expandedRowKeys}
          onExpand={(expanded, record) =>
            this.setState({
              expandedRowKeys:
                record.name === expandedRowKeys[0] ? [] : [record.name]
            })
          }
          expandedRowRender={record => (
            <div>
              {record.name && expandedRowKeys[0] === record.name && (
                <Form onSubmit={e => this.handleSubmit(e, record)}>
                  <ul className={styles.info}>
                    <li>
                      <span>数据库名称：</span>
                      {record.name}
                    </li>
                    <li>
                      <span>简短描述（对内）：</span>
                      {record.desc}
                    </li>
                  </ul>
                  <Form.Item label="title（对外）：">
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true,
                          message: "必填"
                        }
                      ],
                      initialValue: _.get(record, "onlineData.title")
                    })(<Input placeholder="title" />)}
                  </Form.Item>
                  <Form.Item label="一句话介绍（对外）：">
                    {getFieldDecorator("intro", {
                      rules: [
                        {
                          required: true,
                          message: "必填"
                        }
                      ],
                      initialValue: _.get(record, "onlineData.intro")
                    })(<Input placeholder="intro" />)}
                  </Form.Item>
                  <Form.Item label="非会员用户限制页数：">
                    {getFieldDecorator("limit", {
                      rules: [
                        {
                          required: true,
                          message: "必填"
                        }
                      ],
                      initialValue: _.get(record, "onlineData.member.limit")
                    })(<InputNumber placeholder="limit" />)}
                  </Form.Item>
                  <Form.Item label="价格：">
                    {getFieldDecorator("price", {
                      rules: [
                        {
                          required: true,
                          message: "必填"
                        }
                      ],
                      initialValue: _.get(record, "onlineData.member.price")
                    })(<InputNumber placeholder="price" />)}
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.updateLineDb}
                  >
                    更新
                  </Button>
                </Form>
              )}
            </div>
          )}
          loading={loading.getOnlineDbs}
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
      </div>
    );
  }
}

export default DbTable;
