import React, { Component } from "react";
import { Table, Button, Popconfirm, Divider } from "antd";
import { observer } from "../../utils";
import * as styles from "./answerTable.module.scss";

@observer
class AnswerTable extends Component {
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
        title: "answerId",
        width: 100,
        dataIndex: "answerId",
        key: "answerId",
        render: (v, record) => (
          <a
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
        width: 220,
        render: (v, record) => (
          <div
            style={{ width: 200 }}
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
        width: 100,
        render: v => (
          <div>
            {!v ? (
              <span className={styles.notApprove}>未审批</span>
            ) : v === 1 ? (
              <span className={styles.approve}>审批通过</span>
            ) : (
              <span className={styles.delayApprove}>延迟审批</span>
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
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (v, record) => (
          <span>
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

            {record.approve !== 2 && (
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
