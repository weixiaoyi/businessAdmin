import React, { Component } from "react";
import { Table, Button, Card } from "antd";

import classNames from "classnames";
import { Editor } from "../../components";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  state = {
    selectOne: {}
  };

  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;

    dispatch({
      type: "ipc-get-scrapy-answers"
    });
  }

  render() {
    const { selectOne } = this.state;
    const {
      model: { dispatch, answers = [] }
    } = this.props;

    const columns = [
      {
        title: "answerId",
        dataIndex: "answerId",
        key: "answerId",
        render: (v, record) => (
          <a
            onClick={() => {
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
        width: 200,
        render: v => (
          <div style={{ width: 200 }} className={styles.answerContent}>
            {v}
          </div>
        )
      },
      {
        title: "赞同票数",
        dataIndex: "upVoteNum",
        key: "upVoteNum"
      },
      {
        title: "标题",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "作者",
        dataIndex: "authorName",
        key: "authorName"
      }
    ];

    return (
      <div className={classNames(styles.Scrapy, "page")}>
        <div className={styles.list}>
          <div>
            <Button
              type="primary"
              onClick={() => {
                dispatch({
                  type: "ipc-create-scrapy"
                });
              }}
            >
              创建BrowserWindow
            </Button>
          </div>
          <div className={styles.leftContent}>
            <Table
              rowKey={"answerId"}
              columns={columns}
              dataSource={answers}
              onRow={record => {
                return {
                  onClick: () => {
                    this.setState({
                      selectOne: record
                    });
                  } // 点击行
                };
              }}
            />
            <webview
              className={styles.webview}
              src={`https://www.zhihu.com/question/${selectOne.questionId}/answer/${selectOne.answerId}`}
            />
          </div>
        </div>
        <div className={styles.editor}>
          <Editor content={selectOne.content} />
        </div>
      </div>
    );
  }
}

export default Scrapy;
