import React, { Component } from "react";
import { Button } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import { Answer } from "../../components";
import * as styles from "./index.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class OnlineDb extends Component {
  componentDidMount() {
    this.getAllAnswer();
  }

  getAllAnswer = () => {
    const {
      model: { dispatch }
    } = this.props;
  };

  render() {
    const {
      model: { dispatch, onlineAnswers }
    } = this.props;
    return (
      <div className={classNames(styles.onlineDb, "page")}>
        <div className={styles.left}>
          <Button
            onClick={() => {
              dispatch({
                type: "ipc-create-preview-pdf",
                payload: {
                  url: "http://localhost:3000/blank/scrapy/pdf"
                }
              });
            }}
          >
            预览PDF
          </Button>
          <Button
            onClick={() => {
              dispatch({
                type: "ipc-download-pdf"
              });
            }}
          >
            下载PDF
          </Button>
        </div>
        <div className={styles.right}>
          <ul>
            {onlineAnswers.map((item, index) => (
              <li key={item.answerId}>
                <Answer
                  content={item.content}
                  authorName={item.authorName}
                  ins={index + 1}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default OnlineDb;
