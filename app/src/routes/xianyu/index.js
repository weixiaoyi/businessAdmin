import React, { Component } from "react";
import { Collapse, Button, Icon, Tooltip, Table } from "antd";
import {
  Inject,
  getFilename,
  formatMonthTime,
  formatTime,
  toJS
} from "../../utils";
import * as styles from "./index.module.scss";
import {
  Webview,
  DragFix,
  Image,
  Clipboard,
  FullScreen,
  Drawer,
  Form
} from "../../components";
import injectJavaScript from "./injectJavaScript";
import { LayOut } from "../components";

const { Panel } = Collapse;

@Inject(({ xianyuStore: model }) => ({
  model
}))
class XianYu extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.model.dispatch;
  }
  componentDidMount() {
    this.getImageDb();
    this.getImagePath();
    this.getVersionDb();
    this.getProductUrl();
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

  addProductModal = () => {
    const {
      model: { openModal }
    } = this.props;
    openModal({
      name: "drawer"
    });
  };

  addProductUrl = values => {
    this.dispatch({
      type: "ipc-add-productUrl",
      payload: {
        ...values
      }
    });
  };

  getProductUrl = () => {
    this.dispatch({
      type: "ipc-get-productUrls"
    });
  };

  renderInfo = (item, isVersion = false) => {
    let infos = [
      { name: "售价", value: "sellPrice" },
      { name: "原价", value: "prevPrice" },
      { name: "编辑时间", value: "editTime" },
      { name: "浏览", value: "hot" },
      { name: "成色", value: "quality" },
      { name: "vip", value: "vip" },
      { name: "实名认证", value: "userVertify" }
    ];
    if (isVersion) {
      infos = [
        { name: "title", value: "title" },
        { name: "productId", value: "productId" }
      ]
        .concat(infos)
        .concat(
          { name: "desc", value: "desc" },
          { name: "wangwang", value: "wangwang" }
        );
    }
    return (
      <ul className={styles.short}>
        {infos.map(one => (
          <li key={one.name}>
            <span>{one.name}:</span>
            {item[one.value]}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const {
      model: { productsSort, images, imagePath, versions, productUrls }
    } = this.props;

    return (
      <LayOut>
        <div className={styles.xianyu}>
          <div className={styles.title}>
            <div>咸鱼</div>
            <div>
              <Button onClick={this.addProductModal}>商品列表</Button>
            </div>
          </div>
          <DragFix name="xianyu" title="商品监控">
            <Collapse>
              {productsSort.map(item => {
                const id = item.url.replace(/.*id=(.*)$/g, "$1");
                const productImages = images.filter(
                  one => one.productId === id
                );
                return (
                  <Panel
                    className={item.errMsg && styles.errMsgPannel}
                    header={
                      <div>
                        <div className={styles.header}>
                          <strong>{item.title}</strong>
                          {item.errMsg && <span>({item.errMsg})</span>}
                          <Button
                            disabled={!productImages.length > 0}
                            style={{ marginLeft: 20 }}
                            onClick={e => {
                              this.openProductIdPath(id);
                              e.stopPropagation();
                            }}
                          >
                            本地商品{id}图片
                            {!productImages.length > 0 && <span>(暂无)</span>}
                          </Button>
                          <Clipboard
                            text={item.url}
                            style={{ marginLeft: 20 }}
                          />
                        </div>
                        {this.renderInfo(item)}
                        <div className={styles.versionManage}>
                          <span style={{ marginRight: 10 }}>版本管理</span>
                          {[
                            {
                              name: "自动",
                              value: versions.autoSnaps[id]
                            },
                            {
                              name: "手动",
                              value: versions.snaps[id],
                              icon: (
                                <Icon
                                  type="camera"
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (item.errMsg) {
                                      return alert(item.errMsg);
                                    }
                                    this.snapVersion(item);
                                  }}
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
                                    <Tooltip title={this.renderInfo(one, true)}>
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

                      {item.images && item.images.length > 0 && (
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
                      )}
                    </Collapse>
                  </Panel>
                );
              })}
            </Collapse>
          </DragFix>
          <div className={styles.productList}>
            {productUrls.map(item => (
              <FullScreen key={item.url}>
                <Webview
                  style={{ height: "100%" }}
                  executeJavaScript={injectJavaScript}
                  src={item.url}
                />
              </FullScreen>
            ))}
          </div>
        </div>
        <Drawer
          title="商品列表"
          child={{
            title: "添加商品",
            entry: "添加商品",
            children: (
              <div>
                <Form
                  submit={values => {
                    this.addProductUrl({
                      ...values
                    });
                  }}
                  configs={{
                    components: [
                      {
                        field: "url",
                        type: "input",
                        label: "商品地址",
                        rules: [
                          {
                            required: true,
                            message: "必填"
                          }
                        ]
                      }
                    ]
                  }}
                />
              </div>
            )
          }}
        >
          <Table
            rowKey="productId"
            columns={[
              {
                title: "productId",
                dataIndex: "productId",
                key: "productId"
              },
              {
                title: "url",
                dataIndex: "url",
                key: "url"
              },
              {
                title: "createTime",
                dataIndex: "createTime",
                key: "createTime",
                render: v => formatTime(v)
              }
            ]}
            dataSource={productUrls}
          />
        </Drawer>
      </LayOut>
    );
  }
}

export default XianYu;
