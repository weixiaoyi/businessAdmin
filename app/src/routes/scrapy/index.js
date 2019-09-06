import React, { Component } from "react";
import { Table, Button, Card, Popconfirm } from "antd";

import classNames from "classnames";
import _ from "lodash";
import { Editor } from "../../components";
import { Inject, formatTime } from "../../utils";
import Preview from "./preview";
import * as styles from "./index.module.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  state = {
    selectOne: {}
  };

  componentDidMount() {
    this.getAnswers();
  }

  componentDidUpdate() {
    const { selectOne } = this.state;
    const {
      model: { answers }
    } = this.props;
    const findOne = answers.find(item => item.answerId === selectOne.answerId);
    if (findOne && !_.isEqual(findOne, selectOne)) {
      this.setState({
        selectOne: findOne
      });
    }
  }

  getAnswers = ({ current, pageSize } = {}) => {
    const {
      model: { dispatch }
    } = this.props;

    dispatch({
      type: "ipc-get-scrapy-answers",
      payload: {
        current,
        pageSize
      }
    });
  };

  render() {
    const { selectOne } = this.state;
    const {
      model: { dispatch, answers = [], pagination }
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
            onClick={() => {
              this.setState({
                selectOne: record
              });
            }}
          >
            {v}
          </div>
        )
      },
      {
        title: "审批",
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
        title: "赞同票数",
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
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <div className={classNames(styles.Scrapy, "page")}>
        <div className={styles.list}>
          <div className={styles.utils}>
            <Button
              type="primary"
              onClick={() => {
                dispatch({
                  type: "ipc-create-scrapy"
                });
              }}
            >
              创建爬虫
            </Button>
            <Button type="dashed" icon="reload" onClick={this.getAnswers}>
              刷新数据
            </Button>
          </div>
          <div className={styles.leftContent}>
            <Table
              rowClassName={record =>
                selectOne.answerId === record.answerId ? styles.activeRow : null
              }
              pagination={pagination}
              rowKey={"answerId"}
              columns={columns}
              dataSource={answers}
              onChange={this.getAnswers}
            />
            <webview
              className={styles.webview}
              src={
                selectOne.questionId
                  ? `https://www.zhihu.com/question/${selectOne.questionId}/answer/${selectOne.answerId}`
                  : "https://www.zhihu.com/"
              }
            />
          </div>
        </div>
        <div className={styles.editor}>
          {selectOne.title && (
            <div className={styles.contentHeader}>
              <span className={styles.title}>{selectOne.title}</span>
              <div className={styles.info}>
                <span className={styles.author}>({selectOne.authorName})</span>
                {selectOne.createTime && (
                  <span>{formatTime(selectOne.createTime)}</span>
                )}
              </div>
            </div>
          )}

          <Editor content={selectOne.content}>
            {editor => (
              <div className={styles.utils}>
                <Button
                  type="primary"
                  onClick={() => {
                    dispatch({
                      type: "ipc-update-answer",
                      payload: {
                        answerId: selectOne.answerId,
                        content: editor.txt.html()
                      }
                    });
                  }}
                >
                  保存
                </Button>
              </div>
            )}
          </Editor>
          <div className={styles.preview}>
            <Preview content={selectOne.content} />
          </div>
        </div>
      </div>
    );
  }
}

export default Scrapy;
