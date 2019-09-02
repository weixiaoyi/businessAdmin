import React, { Component } from "react";
import { Table, Button } from "antd";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;

    dispatch({
      type: "ipc-get-scrapy-answers"
    });
  }

  render() {
    const {
      model: { dispatch, answers = [] }
    } = this.props;

    const columns = [
      {
        title: "answerId",
        dataIndex: "answerId",
        key: "answerId"
      },
      {
        title: "内容",
        dataIndex: "content",
        key: "content",
        width: 800,
        render: v => (
          <div style={{ width: 800 }} className={styles.answerContent}>
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
      <div className={styles.Scrapy}>
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
        <div>
          <Table rowKey={"answerId"} columns={columns} dataSource={answers} />
        </div>
      </div>
    );
  }
}

export default Scrapy;
