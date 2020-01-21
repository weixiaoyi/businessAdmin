import React, { Component } from "react";
import {
  Collapse,
  Button,
  Icon,
  Tooltip,
  Table,
  Popconfirm,
  InputNumber,
  Tag,
  Divider
} from "antd";
import classNames from "classnames";

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
  Form,
  QrCode,
  Switch,
  Swiper
} from "../../components";
import injectJavaScript from "./injectJavaScript";
import { LayOut } from "../components";
import { tableFilter } from "../../hoc";
import configs from "./config";

const { Panel } = Collapse;

@tableFilter
@Inject(({ onlineStore: model, globalStore }) => ({
  model,
  globalStore
}))
class Online extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.model.dispatch;
    this.state = {
      filter: ""
    };
  }
  componentDidMount() {
    this.getImageDb();
    this.getImagePath();
    this.getVersionDb();
    this.getProductUrl();
  }

  getVersionDb = () => {
    this.dispatch({
      type: "ipc-get-versionDb"
    });
  };

  getImagePath = () => {
    this.dispatch({
      type: "ipc-get-imagePath"
    });
  };

  getImageDb = () => {
    this.dispatch({
      type: "ipc-get-imageDb"
    });
  };

  downloadImage = (dataUrl, filename, productId, index) => {
    this.dispatch({
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
    this.dispatch({
      type: "ipc-open-productIdPath",
      payload: {
        productId
      }
    });
  };

  snapVersion = product => {
    this.dispatch({
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
      name: "productList"
    });
  };

  openUpdateVersionRecordModal = () => {
    const {
      model: { openModal }
    } = this.props;
    openModal({
      name: "updateVersionRecords"
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

  removeProductUrl = productId => {
    this.dispatch({
      type: "ipc-remove-productUrl",
      payload: {
        productId
      }
    });
  };

  getProductUrl = () => {
    this.dispatch({
      type: "ipc-get-productUrls"
    });
  };

  addProductRemark = ({ productId, remark }) => {
    this.dispatch({
      type: "ipc-add-productRemark",
      payload: {
        productId,
        remark
      }
    });
  };

  selectOneProduct = productId => {
    this.dispatch({
      type: "selectOneProduct",
      payload: {
        productId
      }
    });
  };

  autoRefresh = () => {
    this.dispatch({
      type: "autoRefresh"
    });
  };

  changeCollapseGrid = v => {
    this.dispatch({
      type: "changeCollapseGrid",
      payload: {
        columns: v
      }
    });
  };

  deleteVersion = (snapType, productId, createTime) => {
    this.dispatch({
      type: "ipc-delete-Version",
      payload: {
        snapType,
        productId,
        createTime
      }
    });
  };

  render() {
    const { filter } = this.state;
    const {
      model: {
        images,
        imagePath,
        versions,
        normalizedProductUrls,
        selectProductId,
        refresh,
        normalizedUpdateVersionRecords,
        collapseGrid
      },
      globalStore: {
        modal: { name }
      }
    } = this.props;

    return (
      <LayOut>
        <div className={styles.online}>
          <div className={styles.headerUtils}>
            <div className={styles.title}>
              <div>纵浪贸易管理端</div>
              <div>
                <Button
                  onClick={this.autoRefresh}
                  type={refresh ? "danger" : "default"}
                >
                  {refresh ? "监控中" : "启动监控"}
                </Button>
                <Button
                  onClick={this.addProductModal}
                  style={{ marginLeft: 20 }}
                >
                  商品列表
                </Button>
              </div>
            </div>
            <div className={styles.utils}>
              <a onClick={this.openUpdateVersionRecordModal}>版本更新历史</a>
            </div>
          </div>
          <DragFix name="online" title="商品监控">
            <div className={styles.headerutils}>
              <Switch className={styles.search}>
                <Form
                  reset={() =>
                    this.setState({
                      filter: ""
                    })
                  }
                  submit={values => {
                    this.setState({
                      filter: values.search
                    });
                  }}
                  configs={{
                    components: [
                      {
                        field: "search",
                        type: "input",
                        label: "搜索",
                        placeholder: "输入productId或title"
                      }
                    ]
                  }}
                />
              </Switch>
              <InputNumber
                value={Number(collapseGrid)}
                size={"small"}
                min={1}
                max={5}
                step={1}
                onChange={this.changeCollapseGrid}
              />
            </div>

            <Collapse
              className={classNames(
                styles.collapse,
                styles[`collapseGrid-${collapseGrid}`]
              )}
            >
              {normalizedProductUrls
                .filter(item =>
                  filter
                    ? (item.title && item.title.search(filter) !== -1) ||
                      (item.productId && item.productId.search(filter) !== -1)
                    : true
                )
                .map(item => {
                  const id = item.productId;
                  const productImages = images.filter(
                    one => one.productId === id
                  );
                  const findConfigs = configs.websites.find(
                    one => one.text === item.website
                  );
                  return (
                    <Panel
                      className={classNames(
                        item.errMsg && styles.errMsgPannel,
                        selectProductId === item.productId &&
                          styles.selectProductId
                      )}
                      header={
                        <div
                          className={styles.mainheader}
                          onClick={() => this.selectOneProduct(item.productId)}
                        >
                          <div>
                            <div className={styles.header}>
                              <img width={40} src={findConfigs.icon} />
                              <strong style={{ maxWidth: 500 }}>
                                <Clipboard
                                  short={false}
                                  text={item.title}
                                  rows
                                />
                              </strong>
                              {item.errMsg && <span>({item.errMsg})</span>}

                              <Clipboard
                                text={item.url}
                                style={{ marginLeft: 20 }}
                              />
                              <span style={{ marginLeft: 20 }}>
                                <QrCode url={item.url} />
                              </span>
                            </div>
                            {findConfigs.renderInfo &&
                              findConfigs.renderInfo(item)}
                            <div className={styles.versionManage}>
                              {[
                                {
                                  name: "自动版本管理",
                                  value: versions.autoSnaps
                                    ? versions.autoSnaps[id]
                                    : [],
                                  type: "autoSnaps"
                                },
                                {
                                  name: "手动版本管理",
                                  type: "snaps",
                                  value: versions.snaps
                                    ? versions.snaps[id]
                                    : [],
                                  icon: item.title && (
                                    <Icon
                                      type="camera"
                                      onClick={e => {
                                        e.stopPropagation();
                                        if (item.errMsg) {
                                          return alert(item.errMsg);
                                        }
                                        this.snapVersion({
                                          ...item,
                                          productId: id
                                        });
                                      }}
                                    />
                                  )
                                }
                              ].map(i => (
                                <div key={i.name} style={{ marginBottom: 2 }}>
                                  <span className={styles.name}>
                                    ({i.name} {i.icon}):
                                  </span>
                                  <ul>
                                    {(i.value || []).map(one => (
                                      <li key={one.createTime}>
                                        <Tooltip
                                          title={
                                            findConfigs.renderInfo &&
                                            findConfigs.renderInfo(one, true)
                                          }
                                        >
                                          <Tag
                                            closable
                                            onClose={e => {
                                              e.stopPropagation();
                                              this.deleteVersion(
                                                i.type,
                                                one.productId,
                                                one.createTime
                                              );
                                            }}
                                          >
                                            {formatMonthTime(one.createTime)}
                                          </Tag>
                                        </Tooltip>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            {item.remark && (
                              <div>备注：{item.remark.slice(0, 10)}...</div>
                            )}
                          </div>
                          <div className={styles.swiperContainer}>
                            {((item.previews && item.previews.length > 0) ||
                              (item.images && item.images.length > 0)) && (
                              <Swiper
                                className={styles.preview}
                                data={(item.previews && item.previews.length > 0
                                  ? item.previews
                                  : item.images
                                ).map(item => ({ src: item }))}
                              />
                            )}
                            <Button
                              size="small"
                              disabled={!productImages.length > 0}
                              style={{ marginLeft: 20 }}
                              onClick={e => {
                                this.openProductIdPath(id);
                                e.stopPropagation();
                              }}
                            >
                              {id}
                              {!productImages.length > 0 && <span>(暂无)</span>}
                            </Button>
                          </div>
                        </div>
                      }
                      key={item.productId}
                    >
                      {findConfigs.renderDetail &&
                        findConfigs.renderDetail(item)}
                      <Collapse
                        defaultActiveKey="1"
                        style={{ marginTop: 10 }}
                        className={styles.collapseImages}
                      >
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
                          <Panel header={`${item.website}图片`} key="2">
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
            {normalizedProductUrls.map(item => (
              <FullScreen
                className={classNames(
                  selectProductId === item.productId && styles.selectProductId,
                  styles.productItem
                )}
                key={item.url}
                title={item.title || item.productId}
                onClick={() => this.selectOneProduct(item.productId)}
              >
                <Webview
                  auto={refresh}
                  style={{ height: "100%" }}
                  executeJavaScript={injectJavaScript(item.url, item.website)}
                  src={item.url}
                />
              </FullScreen>
            ))}
          </div>
        </div>
        {name === "productList" && (
          <Drawer
            width={"80%"}
            title="商品列表"
            childs={[
              {
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
                            field: "website",
                            type: "select",
                            label: "来源站点",
                            rules: [
                              {
                                required: true,
                                message: "必填"
                              }
                            ],
                            options: configs.websites
                          },
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
              },
              {
                title: "备注",
                children: childrenDrawerData => (
                  <div>
                    <Form
                      submit={values => {
                        this.addProductRemark({
                          ...values,
                          productId: childrenDrawerData.productId
                        });
                      }}
                      configs={{
                        components: [
                          {
                            field: "remark",
                            initialValue: childrenDrawerData.remark,
                            type: "textarea",
                            label: `${
                              childrenDrawerData.title
                                ? childrenDrawerData.title
                                : childrenDrawerData.productId
                            }`,
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
              }
            ]}
          >
            {showChildModal => (
              <Table
                expandedRowRender={record => <p>备注：{record.remark}</p>}
                pagination={false}
                scroll={{ x: 800 }}
                rowClassName={record =>
                  selectProductId === record.productId
                    ? styles.selectProductId
                    : ""
                }
                onRow={record => ({
                  onClick: () => this.selectOneProduct(record.productId)
                })}
                rowKey="productId"
                columns={[
                  {
                    title: "来源站点",
                    dataIndex: "website",
                    key: "website",
                    width: 80
                  },
                  {
                    title: "title",
                    dataIndex: "title",
                    key: "title",
                    width: 300,
                    ...this.props.getColumnSearchProps("title")
                  },
                  {
                    title: "productId",
                    dataIndex: "productId",
                    key: "productId",
                    width: 150,
                    ...this.props.getColumnSearchProps("productId")
                  },

                  {
                    title: "url",
                    dataIndex: "url",
                    key: "url",
                    render: v => <Clipboard text={v} />
                  },
                  {
                    title: "createTime",
                    dataIndex: "createTime",
                    key: "createTime",
                    render: v => formatTime(v)
                  },
                  {
                    title: "操作",
                    width: 100,
                    dataIndex: "operation",
                    key: "operation",
                    fixed: "right",
                    align: "center",
                    render: (v, record) => {
                      return (
                        <span>
                          <Popconfirm
                            title="确认删除该商品?该操作务必谨慎！"
                            onConfirm={() =>
                              this.removeProductUrl(record.productId)
                            }
                          >
                            <a>删除</a>
                          </Popconfirm>
                          <Divider type="vertical" />
                          <a onClick={() => showChildModal("备注", record)}>
                            备注
                          </a>
                        </span>
                      );
                    }
                  }
                ]}
                dataSource={normalizedProductUrls}
              />
            )}
          </Drawer>
        )}
        {name === "updateVersionRecords" && (
          <Drawer title="版本更新历史">
            <Table
              pagination={false}
              scroll={{ x: 800 }}
              rowKey="createTime"
              columns={[
                {
                  title: "title",
                  dataIndex: "title",
                  key: "title"
                },
                {
                  title: "productId",
                  dataIndex: "productId",
                  key: "productId"
                }
              ]}
              dataSource={normalizedUpdateVersionRecords}
            />
          </Drawer>
        )}
      </LayOut>
    );
  }
}

export default Online;
