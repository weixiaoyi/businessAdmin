import React, { Component } from "react";
import { Icon } from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Inject, formatMonthTime } from "../../utils";
import * as styles from "./index.module.scss";

const LoadingIcon = (
  <Icon
    className={styles.loading}
    type="loading"
    style={{ fontSize: 24 }}
    spin
  />
);

@Inject(({ globalStore: model }) => ({
  model
}))
class Webview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("webview_"),
      refreshTime: "",
      refreshTimeCount: 0,
      loading: false
    };
    this.errReloadTimes = 0;
    this.interval = null;
  }

  componentDidMount() {
    const { id } = this.state;
    const {
      domReady,
      executeJavaScript,
      src,
      auto,
      interval = 30 * 60 * 1000
    } = this.props;
    const webview = document.querySelector(`#${id}`);
    this.webview = webview;

    webview.addEventListener("did-start-loading", () => {
      this.setState({
        loading: true
      });
    });
    webview.addEventListener("did-stop-loading", () => {
      this.setState({
        loading: false
      });
    });
    webview.addEventListener("dom-ready", () => {
      if (_.isFunction(domReady)) {
        domReady();
      }

      if (executeJavaScript && _.isFunction(executeJavaScript)) {
        webview.executeJavaScript(executeJavaScript(src));
        this.setState({
          refreshTime: Date.now(),
          refreshTimeCount: this.state.refreshTimeCount + 1,
          loading: false
        });
      }
    });

    webview.addEventListener("did-fail-load", () => {
      if (this.webview && this.errReloadTimes < 3) {
        this.webview.reload();
        this.errReloadTimes = this.errReloadTimes + 1;
      }
    });

    if (auto && interval) {
      clearInterval(this.interval);
      this.interval = setInterval(this.reload, interval);
    }
  }

  componentWillMount() {
    if (this.webview && this.webview.removeEventListener) {
      this.webview.removeEventListener();
    }
    clearInterval(this.interval);
  }

  reload = () => {
    this.webview && this.webview.reload();
  };

  openDevTools = () => {
    this.webview && this.webview.openDevTools();
  };

  render() {
    const { id, refreshTime, refreshTimeCount, loading } = this.state;
    const {
      className,
      src,
      style,
      model: {
        globalConfigs: { preloadJsPath }
      }
    } = this.props;
    return (
      <div style={style} className={styles.webview}>
        <div className={styles.utils}>
          <Icon type="reload" onClick={this.reload} />
          <Icon type="security-scan" onClick={this.openDevTools} />
        </div>
        <div className={styles.webviewCenter}>
          <webview
            preload={`file://${preloadJsPath}`}
            nodeintegration={"true"}
            webpreferences="allowRunningInsecureContent, javascript=yes"
            id={id}
            style={style}
            allowpopups={"true"}
            className={classNames(className)}
            src={src}
          />
          {loading && LoadingIcon}
        </div>

        {refreshTime && (
          <div className={styles.refreshTime}>
            数据时间：{formatMonthTime(refreshTime)},第{refreshTimeCount}次
          </div>
        )}
      </div>
    );
  }
}

export default Webview;
