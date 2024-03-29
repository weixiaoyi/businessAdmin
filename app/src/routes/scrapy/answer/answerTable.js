import React, { Component } from "react";
import { Table, Button, Popconfirm, Divider } from "antd";
import { observer } from "../../../utils";
import { TableSearch } from "../../components";
import * as styles from "./answerTable.module.scss";

@observer
class AnswerTable extends TableSearch {
  componentDidMount() {
    this.props.getAnswers();
  }

  render() {
    const {
      dispatch,
      answers = [],
      pagination,
      getAnswers,
      switchAnswer,
      updateAnswer,
      selectOne,
      setSelectRows
    } = this.props;

    const columns = [
      {
        title: "id",
        dataIndex: "answerId",
        key: "answerId",
        ...this.getColumnSearchProps("answerId"),
        render: (v, record) => (
          <a
            className={styles.answerId}
            onClick={e => {
              e.stopPropagation();
              dispatch({
                type: "ipc-create-answer-preview",
                payload: {
                  href: `https://www.zhihu.com/question/${record.questionId}/answer/${record.answerId}`
                }
              });
            }}
          >
            {v}
          </a>
        )
      },
      {
        title: "内容",
        dataIndex: "content",
        key: "content",
        ...this.getColumnSearchProps("content"),
        render: (v, record) => (
          <div
            style={{ width: 80 }}
            className={styles.answerContent}
            onClick={() =>
              switchAnswer({
                selectOne: record,
                editable: record.approve !== 1
              })
            }
          >
            {v}
          </div>
        )
      },
      {
        title: "状态",
        dataIndex: "approve",
        key: "approve",
        ...this.getColumnSearchProps("approve"),
        render: v => (
          <div>
            {!v ? (
              <span className={styles.notApprove}>未审批</span>
            ) : v === 1 ? (
              <span className={styles.approve}>审批通过</span>
            ) : v === 2 ? (
              <span className={styles.delayApprove}>延迟审批</span>
            ) : (
              "未知"
            )}
          </div>
        )
      },
      {
        title: "是否上线",
        dataIndex: "online",
        key: "online",
        ...this.getColumnSearchProps("online"),
        render: v => (
          <div>
            {v === "on" ? (
              <span className={styles.online}>已上线</span>
            ) : v === "off" ? (
              <span className={styles.offline}>已下线</span>
            ) : v === "upload" ? (
              <span>已经上传</span>
            ) : (
              <span className={styles.waitUpload}>等待上传</span>
            )}
          </div>
        )
      },

      {
        title: "赞同",
        dataIndex: "upVoteNum",
        key: "upVoteNum"
      },
      {
        title: "本地操作",
        dataIndex: "operation",
        fixed: "right",
        width: 150,
        key: "operation",
        render: (v, record) => (
          <span style={{ paddingLeft: 10 }}>
            {!record.online && (
              <>
                <Popconfirm
                  title="确认删除?"
                  onConfirm={() => {
                    dispatch({
                      type: "ipc-delete-answer",
                      payload: {
                        answerId: record.answerId
                      }
                    });
                  }}
                >
                  <a className={styles.delete}>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
              </>
            )}

            {record.approve !== 1 && (
              <>
                <a
                  onClick={() => {
                    updateAnswer({
                      answerId: record.answerId,
                      approve: 1
                    });
                  }}
                >
                  通过
                </a>
                <Divider type="vertical" />
              </>
            )}

            {record.approve !== 2 && record.online !== "on" && (
              <>
                <a
                  onClick={() => {
                    updateAnswer({
                      answerId: record.answerId,
                      approve: 2
                    });
                  }}
                >
                  延迟
                </a>
              </>
            )}
          </span>
        )
      },
      {
        title: "同步服务器",
        dataIndex: "server",
        fixed: "right",
        width: 170,
        key: "server",
        render: (v, record) => (
          <span>
            {(record.online === "off" || record.online === "upload") && (
              <>
                <Popconfirm
                  title="确认删除?"
                  onConfirm={() => {
                    dispatch({
                      type: "deleteLineAnswer",
                      payload: {
                        answerId: record.answerId
                      }
                    });
                  }}
                >
                  <a className={styles.delete}>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
              </>
            )}

            {record.approve === 1 && !record.online && (
              <>
                <a
                  onClick={() => {
                    dispatch({
                      type: "uploadAnswer",
                      payload: {
                        answerId: record.answerId,
                        content: record.content,
                        title: record.title,
                        questionId: record.questionId,
                        authorName: record.authorName,
                        prevUpVoteNum: record.upVoteNum
                      }
                    });
                  }}
                >
                  上传
                </a>
                <Divider type="vertical" />
              </>
            )}

            {(record.online === "upload" || record.online === "off") &&
              record.approve === 1 && (
                <>
                  <a
                    onClick={() => {
                      dispatch({
                        type: "onlineAnswer",
                        payload: {
                          answerId: record.answerId
                        }
                      });
                    }}
                  >
                    上线
                  </a>
                  <Divider type="vertical" />
                </>
              )}

            {record.online === "on" && (
              <>
                <a
                  onClick={() => {
                    dispatch({
                      type: "offlineAnswer",
                      payload: {
                        answerId: record.answerId
                      }
                    });
                  }}
                >
                  下线
                </a>
                <Divider type="vertical" />
              </>
            )}

            {record.online && record.update && (
              <>
                <a
                  onClick={() => {
                    dispatch({
                      type: "updateLineAnswer",
                      payload: {
                        answerId: record.answerId,
                        content: record.content
                      }
                    });
                  }}
                >
                  更新
                </a>
                <Divider type="vertical" />
              </>
            )}

            <a
              onClick={() => {
                dispatch({
                  type: "checkLineAnswer",
                  payload: {
                    answerId: record.answerId
                  }
                });
              }}
            >
              检测
            </a>
          </span>
        )
      }
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const answerIds = selectedRows.map(item => item.answerId);
        setSelectRows(answerIds);
      },
      getCheckboxProps: record => ({
        disabled: record.approve === 1 || record.approve === 2
      })
    };
    return (
      <Table
        expandedRowRender={record => <div>{record.content}</div>}
        scroll={{ x: 800 }}
        rowSelection={rowSelection}
        rowClassName={record =>
          selectOne.answerId === record.answerId ? styles.activeRow : null
        }
        pagination={pagination}
        rowKey={"answerId"}
        columns={columns}
        dataSource={answers}
        onChange={getAnswers}
      />
    );
  }
}

export default AnswerTable;
