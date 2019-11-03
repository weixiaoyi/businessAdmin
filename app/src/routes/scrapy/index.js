import React, { Component } from "react";
import { Radio, Form, Tabs, Select } from "antd";
import classNames from "classnames";
import { LayOut } from "../components";
import { Inject } from "../../utils";
import { db, PATH } from "../../constants";
import Answer from "./answer";
import PreviewPdf from "./previewPdf";
import OnlineAnswerDb from "./onlineAnswerDb";
import OnlineUser from "./onlineUser";
import OnlineWebsiteConfig from "./onlineWebsiteConfig";
import OnlineIdea from "./onlineIdea";
import OnlineGroup from "./onlineGroup";
import OnlineSensitiveWord from "./onlineSensitiveWord";
import OnlineComment from "./onlineComment";
import * as styles from "./index.module.scss";

const { Option, OptGroup } = Select;

@Form.create()
@Inject(({ scrapyStore: model }) => ({
  model
}))
class Scrapy extends Component {
  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-get-appPath"
    });
  }
  state = {
    active: "answer"
  };

  render() {
    const { active } = this.state;
    const {
      model: { dbName, dispatch }
    } = this.props;
    const navs = [
      { name: "answer", desc: "本地answer/同步线上" },
      { name: "previewpdf", desc: "pdf预览发布" },
      { name: "onlineWebsiteConfig", desc: "网站配置" },
      { name: "onlinedb", desc: "answer-Db(线上/线下)" },
      { name: "onlineUser", desc: "User-blackUser" },
      { name: "onlineIdea", desc: "Idea-Detail" },
      { name: "onlineComment", desc: "Comment" },
      { name: "onlineGroup", desc: "副业圈group" },
      { name: "onlineSensitiveWord", desc: "敏感词" }
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
          {active === "previewpdf" && <PreviewPdf />}
          {active === "onlineWebsiteConfig" && <OnlineWebsiteConfig />}
          {active === "onlinedb" && <OnlineAnswerDb />}
          {active === "onlineUser" && <OnlineUser />}
          {active === "onlineIdea" && <OnlineIdea />}
          {active === "onlineComment" && <OnlineComment />}
          {active === "onlineGroup" && <OnlineGroup />}
          {active === "onlineSensitiveWord" && <OnlineSensitiveWord />}
        </div>
      </LayOut>
    );
  }
}

export default Scrapy;
