import React, { Component } from "react";
import { Inject } from "../../utils";
import { Answer } from "../components";
import * as styles from "./index.module.scss";

@Inject(({ scrapyManageDbStore: model }) => ({
  model
}))
class ScrapyPdf extends Component {
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
      model: { answers }
    } = this.props;
    return (
      <div className={styles.pdf}>
        <ul>
          {answers.map((item, index) => (
            <li key={item.answerId}>
              <Answer
                className={styles.pdfAnswer}
                content={item.content}
                authorName={item.authorName}
                ins={index + 1}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ScrapyPdf;
