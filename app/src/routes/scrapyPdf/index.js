import React, { Component } from "react";
import { Inject, parseString, parseImage } from "../../utils";
import Answer from "../scrapy/components/Answer";
import * as styles from "./index.module.scss";

@Inject(({ pdfStore: model }) => ({
  model
}))
class ScrapyPdf extends Component {
  componentDidMount() {
    this.getAllAnswer();
  }

  getAllAnswer = () => {
    const {
      model: { dispatch },
      history: {
        location: { search }
      }
    } = this.props;
    const dbName = parseString(search).dbName;
    if (!dbName) return alert("未从地址栏获取到dbName查询参数");
    dispatch({
      type: "ipc-get-scrapy-all-answers",
      payload: {
        dbName: parseString(search).dbName
      }
    });
  };

  render() {
    const {
      history: {
        location: { search }
      },
      model: { answers }
    } = this.props;
    const dbName = parseString(search).dbName;
    const imagesPath = parseString(search).imagesPath;
    return (
      <div className={styles.pdf}>
        <ul>
          {answers.map((item, index) => (
            <li key={item.answerId}>
              <Answer
                className={styles.pdfAnswer}
                content={parseImage(item.content, dbName, imagesPath)}
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
