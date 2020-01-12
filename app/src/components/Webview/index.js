import React, { Component } from "react";
import { Icon } from "antd";
import _ from "lodash";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";

@Inject(({ globalStore: model }) => ({
  model
}))
class Webview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("webview_")
    };
    this.reloadTimes = 0;
  }

  componentDidMount() {
    const { id } = this.state;
    const { domReady, executeJavaScript, src } = this.props;
    const webview = document.querySelector(`#${id}`);
    this.webview = webview;
    webview.addEventListener("dom-ready", () => {
      webview.openDevTools();
      if (_.isFunction(domReady)) {
        domReady();
      }

      if (executeJavaScript && _.isFunction(executeJavaScript)) {
        webview.executeJavaScript(executeJavaScript(src));
      }
    });

    webview.addEventListener("did-fail-load", () => {
      if (this.webview && this.reloadTimes < 3) {
        this.webview.reload();
        this.reloadTimes++;
      }
    });
  }

  componentWillMount() {
    if (this.webview && this.webview.removeEventListener) {
      this.webview.removeEventListener();
    }
  }

  reload = () => {
    this.webview && this.webview.reloadIgnoringCache();
  };

  render() {
    const { id } = this.state;
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
        </div>
        <webview
          preload={`file://${preloadJsPath}`}
          nodeintegration={"true"}
          webpreferences="allowRunningInsecureContent, javascript=yes"
          id={id}
          style={style}
          allowpopups={"true"}
          className={className}
          src={src}
        />
      </div>
    );
  }
}

export default Webview;
