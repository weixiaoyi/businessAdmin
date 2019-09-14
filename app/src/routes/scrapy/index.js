import React, { Component } from "react";
import { Radio, Form, Tabs, Select } from "antd";
import classNames from "classnames";
import { LayOut } from "../components";
import { Inject } from "../../utils";
import { db, PATH } from "../../constants";
import Answer from "./answer";
import ManageDb from "./managedb";
import * as styles from "./index.module.scss";

const { Option, OptGroup } = Select;

@Form.create()
@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  state = {
    active: "manageDb"
  };

  render() {
    const { active } = this.state;
    const {
      model: { dbName, dispatch }
    } = this.props;
    const navs = [
      { name: "answer", desc: "所有answer" },
      { name: "manageDb", desc: "当前数据库管理" }
    ];
    return (
      <LayOut>
        <div className={classNames(styles.Scrapy, "page")}>
          <div className={styles.switchNavs}>
            <div>
              <Radio.Group
                value={active}
                onChange={e => {
                  this.setState({
                    active: e.target.value
                  });
                  this.props.history.push({
                    pathname: PATH.scrapy,
                    search: `?active=${e.target.value}`
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
          {active === "answer" && <Answer />}
          {active === "manageDb" && <ManageDb />}
        </div>
      </LayOut>
    );
  }
}

export default Scrapy;
