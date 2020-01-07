import React, { Component } from "react";
import { Collapse, Button } from "antd";
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
    this.getImageDb();
    this.getImagePath();
  }

  getImagePath = () => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-get-imagePath"
    });
  };

  getImageDb = () => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-get-imageDb"
    });
  };

  downloadImage = (dataUrl, filename, productId, index) => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-download-image",
      payload: {
        dataUrl,
        filename,
        productId,
        index
      }
    });
  };

  openProductIdPath = productId => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-open-productIdPath",
      payload: {
        productId
      }
    });
  };

  render() {
    const {
      model: { products, images, imagePath }
    } = this.props;

    return (
      <LayOut>
        <div className={styles.xianyu}>
          咸鱼
          <DragFix name="xianyu" title="商品监控">
            {JSON.stringify(products)}
            <Collapse>
              {products.map(item => {
                const id = item.url.replace(/.*id=(.*)$/g, "$1");
                const productImages = images.filter(
                  one => one.productId === id
                );
                return (
                  <Panel
                    header={
                      <div>
                        <div>
                          <strong>{item.title}</strong>
                          <Button
                            style={{ marginLeft: 20 }}
                            onClick={e => {
                              this.openProductIdPath(id);
                              e.stopPropagation();
                            }}
                          >
                            本地商品{id}图片
                          </Button>
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
                      {productImages.length > 0 && (
                        <Panel header="本地图片" key="1">
                          <ul className={styles.imagesList}>
                            {productImages.map(one => (
                              <li key={one.filename}>
                                <Image
                                  className={styles.linkimg}
                                  src={
                                    window.path.join(
                                      `file://`,
                                      imagePath,
                                      one.productId,
                                      one.filename
                                    ) + ".jpg"
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </Panel>
                      )}

                      <Panel header="闲鱼图片" key="2">
                        <ul className={styles.imagesList}>
                          {item.images.map((one, index) => (
                            <li key={one}>
                              <Image
                                download={(dataUrl, filename) =>
                                  this.downloadImage(
                                    dataUrl,
                                    `${index}_${filename}`,
                                    id,
                                    index
                                  )
                                }
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
                );
              })}
            </Collapse>
          </DragFix>
          <div>
            <Webview
              executeJavaScript={injectJavaScript}
              style={{ height: 1000 }}
              src={
                "https://2.taobao.com/item.htm?spm=2007.1000261.0.0.7e7b34f1C9apOj&id=606530665113"
              }
            />
          </div>
        </div>
      </LayOut>
    );
  }
}

export default XianYu;
