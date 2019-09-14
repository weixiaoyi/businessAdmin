import React, { Component } from "react";
import { Inject } from "../../utils";
import { Answer } from "../components";

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
      <div className="pdf">
        <ul>
          {answers.map(item => (
            <li key={item.answerId}>
              <Answer content={item.content} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ScrapyPdf;
