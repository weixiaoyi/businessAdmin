import React, { Component } from "react";
import { Button } from "antd";
import classNames from "classnames";
import { Inject } from "../../../utils";
import { Answer } from "../../components";
import * as styles from "./index.module.scss";

@Inject(({ pdfStore: model }) => ({
  model
}))
class PreviewPdf extends Component {
  componentDidMount() {
    this.getAllAnswer();
  }

  getAllAnswer = () => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-get-scrapy-all-answers"
    });
  };

  render() {
    const {
      model: { dispatch, answers }
    } = this.props;
    return (
      <div className={classNames(styles.previewpdf, "page")}>
        <div className={styles.left}>
          <Button
            onClick={() => {
              dispatch({
                type: "ipc-create-preview-pdf",
                payload: {
                  url: "http://localhost:3000#/blank/scrapy/pdf"
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
            {answers.map((item, index) => (
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

export default PreviewPdf;
