import React, { Component } from "react";
import { Radio, Form, Tabs, Select } from "antd";
import classNames from "classnames";
import { Inject } from "../../utils";
import { db } from "../../constants";
import Answer from "./answer";
import * as styles from "./index.module.scss";

const { Option, OptGroup } = Select;

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
    const {
      model: { dbName, dispatch }
    } = this.props;
    const navs = [
      { name: "answer", desc: "所有answer" },
      { name: "db", desc: "当前数据库管理" }
    ];
    return (
      <div className={classNames(styles.Scrapy, "page")}>
        <div className={styles.switchNavs}>
          <div>
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
          <div>
            <Select
              value={dbName}
              style={{ width: 200 }}
              onChange={value => {
                dispatch({
                  type: "commit",
                  payload: {
                    dbName: value
                  }
                }).then(() => window.location.reload());
              }}
            >
              {db.scrapy.map(item => (
                <OptGroup key={item.name} label={item.desc}>
                  <Option value={item.name}>{item.name}</Option>
                </OptGroup>
              ))}
            </Select>
          </div>
        </div>
        {active === "answer" && <Answer />},
      </div>
    );
  }
}

export default Scrapy;
