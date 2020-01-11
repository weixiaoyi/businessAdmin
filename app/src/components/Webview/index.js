import React, { Component } from "react";
import _ from "lodash";
import { Inject } from "../../utils";

@Inject(({ globalStore: model }) => ({
  model
}))
class Webview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("webview_")
    };
  }

  componentDidMount() {
    const { id } = this.state;
    const { domReady, executeJavaScript, src } = this.props;
    const webview = document.querySelector(`#${id}`);

    webview.addEventListener("dom-ready", () => {
      this.webview = webview;
      webview.openDevTools();
      if (_.isFunction(domReady)) {
        domReady();
      }

      if (executeJavaScript && _.isFunction(executeJavaScript)) {
        webview.executeJavaScript(executeJavaScript(src));
      }
    });
  }

  componentWillMount() {
    if (this.webview && this.webview.removeEventListener) {
      this.webview.removeEventListener();
    }
  }

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
    );
  }
}

export default Webview;
