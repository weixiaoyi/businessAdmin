import React, { Component } from "react";
import { Collapse, Button, Icon, Tooltip } from "antd";
import { Inject, getFilename, formatMonthTime } from "../../utils";
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
    this.getVersionDb();
  }

  getVersionDb = () => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-get-versionDb"
    });
  };

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

  snapVersion = product => {
    const {
      model: { dispatch }
    } = this.props;
    dispatch({
      type: "ipc-snap-version",
      payload: {
        product
      }
    });
  };

  renderInfo = item => (
    <ul className={styles.short}>
      {[
        { name: "售价", value: "sellPrice" },
        { name: "原价", value: "prevPrice" },
        { name: "编辑时间", value: "editTime" },
        { name: "浏览", value: "hot" },
        { name: "成色", value: "quality" },
        { name: "vip", value: "vip" },
        { name: "实名认证", value: "userVertify" }
      ].map(one => (
        <li key={one.name}>
          <span>{one.name}:</span>
          {item[one.value]}
        </li>
      ))}
    </ul>
  );

  render() {
    const {
      model: { products, images, imagePath, versions }
    } = this.props;

    return (
      <LayOut>
        <div className={styles.xianyu}>
          咸鱼
          <DragFix name="xianyu" title="商品监控">
            {/*{JSON.stringify(products)}*/}
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
                        {this.renderInfo(item)}
                        <div className={styles.versionManage}>
                          <span style={{ marginRight: 10 }}>版本管理</span>
                          {[
                            {
                              name: "自动",
                              value: versions.autoSnaps
                            },
                            {
                              name: "手动",
                              value: versions.snaps,
                              icon: (
                                <Icon
                                  type="camera"
                                  onClick={() => this.snapVersion(item)}
                                />
                              )
                            }
                          ].map(i => (
                            <div key={i.name}>
                              <span>
                                ({i.name} {i.icon}):
                              </span>
                              <ul>
                                {(i.value || []).map(one => (
                                  <li key={one.createTime}>
                                    <Tooltip title={this.renderInfo(one)}>
                                      {formatMonthTime(one.createTime)}
                                    </Tooltip>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                    key={item.url}
                  >
                    <ul className={styles.short}>
                      {[{ name: "旺旺", value: "wangwang" }].map(one => (
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
