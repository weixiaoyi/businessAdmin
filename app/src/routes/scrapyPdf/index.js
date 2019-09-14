import React, { Component } from "react";
import { Inject } from "../../utils";

@Inject(({ scrapyPdfStore: model }) => ({
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
    console.log(answers, "-----answers");
    return <div className="pdf">pdf</div>;
  }
}

export default ScrapyPdf;
