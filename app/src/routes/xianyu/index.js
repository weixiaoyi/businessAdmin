import React, { Component } from "react";
import { Collapse, Button, Icon, Tooltip, Table, Popconfirm } from "antd";
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
  OpenExternal,
  Switch
} from "../../components";
import injectJavaScript from "./injectJavaScript";
import { LayOut } from "../components";
import { tableFilter } from "../../hoc";

const { Panel } = Collapse;

@tableFilter
@Inject(({ xianyuStore: model, globalStore }) => ({
  model,
  globalStore
}))
class XianYu extends Component {
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
    this.openModal({
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
          { name: "wangwang", value: "wangwang" },
          {
            name: "个人中心",
            value: "wangwangPersonCenter",
            render: (name, value) => (
              <span>
                <OpenExternal href={value}>前往</OpenExternal>
                <Clipboard className={styles.personCenter} text={value} />
              </span>
            )
          },
          { name: "desc", value: "desc" }
        );
    }
    return (
      <ul className={styles.short}>
        {infos.map(one => (
          <li key={one.name}>
            <span>{one.name}: </span>
            {one.render
              ? one.render(one.name, item[one.value])
              : item[one.value]}
          </li>
        ))}
      </ul>
    );
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
        normalizedUpdateVersionRecords
      },
      globalStore: {
        modal: { name }
      }
    } = this.props;

    return (
      <LayOut>
        <div className={styles.xianyu}>
          <div className={styles.headerUtils}>
            <div className={styles.title}>
              <div>咸鱼</div>
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
          <DragFix name="xianyu" title="商品监控">
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

            <Collapse>
              {normalizedProductUrls
                .filter(item =>
                  filter
                    ? (item.title && item.title.search(filter) !== -1) ||
                      (item.productId && item.productId.search(filter) !== -1)
                    : true
                )
                .map(item => {
                  const id = item.url.replace(/.*id=(.*)$/g, "$1");
                  const productImages = images.filter(
                    one => one.productId === id
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
                          onClick={() => this.selectOneProduct(item.productId)}
                        >
                          <div className={styles.header}>
                            <strong>
                              <Clipboard short={false} text={item.title} />
                            </strong>
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
                            <span style={{ marginLeft: 20 }}>
                              <QrCode url={item.url} />
                            </span>
                          </div>
                          {this.renderInfo(item)}
                          <div className={styles.versionManage}>
                            <span style={{ marginRight: 10 }}>版本管理</span>
                            {[
                              {
                                name: "自动",
                                value: versions.autoSnaps
                                  ? versions.autoSnaps[id]
                                  : []
                              },
                              {
                                name: "手动",
                                value: versions.snaps ? versions.snaps[id] : [],
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
                                      <Tooltip
                                        title={this.renderInfo(one, true)}
                                      >
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
                      key={item.productId}
                    >
                      <ul className={styles.short}>
                        {[{ name: "旺旺", value: "wangwang" }].map(one => (
                          <li key={one.name}>
                            <span>{one.name}:</span>
                            {item[one.value]}
                          </li>
                        ))}
                      </ul>
                      <Clipboard text={item.desc} short={false} />
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
                  executeJavaScript={injectJavaScript}
                  src={item.url}
                />
              </FullScreen>
            ))}
          </div>
        </div>
        {name === "productList" && (
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
                  title: "title",
                  dataIndex: "title",
                  key: "title",
                  ...this.props.getColumnSearchProps("title")
                },
                {
                  title: "productId",
                  dataIndex: "productId",
                  key: "productId",
                  ...this.props.getColumnSearchProps("productId")
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
                },
                {
                  title: "操作",
                  width: 50,
                  dataIndex: "operation",
                  key: "operation",
                  fixed: "right",
                  align: "center",
                  render: (v, record) => {
                    return (
                      <Popconfirm
                        title="确认删除该商品?该操作务必谨慎！"
                        onConfirm={() =>
                          this.removeProductUrl(record.productId)
                        }
                      >
                        <a>删除</a>
                      </Popconfirm>
                    );
                  }
                }
              ]}
              dataSource={normalizedProductUrls}
            />
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

export default XianYu;
