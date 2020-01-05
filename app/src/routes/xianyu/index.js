import React, { Component } from "react";
import { Collapse } from "antd";
import { Inject, getFilename } from "../../utils";
import * as styles from "./index.module.scss";
import { Webview, DragFix, Image } from "../../components";
import injectJavaScript from "./injectJavaScript";
import { LayOut } from "../components";

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

  downloadImage = (dataUrl, filename, productId) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-download-image",
      payload: {
        dataUrl,
        filename,
        productId
      }
    });
  };

  render() {
    const {
      model: { products }
    } = this.props;

    return (
      <LayOut>
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
                            <Image
                              download={(dataUrl, filename) => {
                                const id = item.url.replace(
                                  /.*id=(.*)$/g,
                                  "$1"
                                );
                                this.downloadImage(dataUrl, filename, id);
                              }}
                              src={one}
                              filename={getFilename(one)}
                              className={styles.linkimg}
                            />
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
      </LayOut>
    );
  }
}

export default XianYu;
