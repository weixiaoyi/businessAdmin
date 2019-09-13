import React, { Component } from "react";
import { Form } from "antd";
import classNames from "classnames";
import { Inject } from "../../utils";
import Answer from "./answer";
import * as styles from "./index.module.scss";

@Form.create()
@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  state = {
    active: "answer"
  };

  render() {
    const { active } = this.state;
    return (
      <div className={classNames(styles.Scrapy, "page")}>
        {active === "answer" && <Answer />}
      </div>
    );
  }
}

export default Scrapy;
