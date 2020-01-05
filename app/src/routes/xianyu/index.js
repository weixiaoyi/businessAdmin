import React, { Component } from "react";
import { Collapse } from "antd";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";
import { Webview, DragFix } from "../../components";
import injectJavaScript from "./injectJavaScript";

const { Panel } = Collapse;

@Inject(({ xianyuStore: model }) => ({
  model
}))
class XianYu extends Component {
  componentDidMount() {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-xianyu-test"
    });
  }

  render() {
    const {
      model: { products }
    } = this.props;
    const text = "12334";
    return (
      <div className={styles.xianyu}>
        咸鱼
        <DragFix name="xianyu" title="商品监控">
          {JSON.stringify(products)}
          <Collapse>
            {products.map(item => (
              <Panel
                header={
                  <div>
                    <div>
                      <strong>{item.title}</strong>
                    </div>
                    <ul className={styles.short}>
                      {[
                        { name: "售价", value: "sellPrice" },
                        { name: "原价", value: "prevPrice" },
                        { name: "编辑时间", value: "editTime" },
                        { name: "浏览", value: "hot" },
                        { name: "成色", value: "quality" }
                      ].map(one => (
                        <li key={one.name}>
                          <span>{one.name}:</span>
                          {item[one.value]}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                key={item.url}
              >
                <ul className={styles.short}>
                  {[
                    { name: "旺旺", value: "wangwang" },
                    { name: "vip", value: "vip" },
                    { name: "实名认证", value: "userVertify" }
                  ].map(one => (
                    <li key={one.name}>
                      <span>{one.name}:</span>
                      {item[one.value]}
                    </li>
                  ))}
                </ul>
                {item.desc}
                <Collapse defaultActiveKey="1" style={{ marginTop: 10 }}>
                  <Panel header="闲鱼图片" key="1">
                    <ul className={styles.imagesList}>
                      {item.images.map(one => (
                        <li key={one}>
                          <img src={one} className={styles.linkimg} />
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </Collapse>
              </Panel>
            ))}
          </Collapse>
        </DragFix>
        <div>
          <Webview
            executeJavaScript={injectJavaScript}
            style={{ height: 1000 }}
            src={
              "https://2.taobao.com/item.htm?spm=2007.1000261.0.0.6f1834f16hrC3I&id=604685713430"
            }
          />
        </div>
      </div>
    );
  }
}

export default XianYu;
