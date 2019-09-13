import React, { Component } from "react";
import { Radio, Form, Tabs } from "antd";
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
    const navs = [
      { name: "answer", desc: "所有answer" },
      { name: "question", desc: "所有question" }
    ];
    return (
      <div className={classNames(styles.Scrapy, "page")}>
        <div className={styles.switchNavs}>
          <Radio.Group
            value={active}
            onChange={e => {
              this.setState({
                active: e.target.value
              });
            }}
          >
            {navs.map(item => (
              <Radio.Button key={item.name} value={item.name}>
                {item.desc}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        {active === "answer" && <Answer />},
      </div>
    );
  }
}

export default Scrapy;
