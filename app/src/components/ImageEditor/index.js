import React, { Component } from "react";
import { notification } from "antd";
import { Clipboard } from "../index";
import ImageUIEditor from "tui-image-editor";
import blackTheme from "./theme/black-theme";
import { bindWindow } from "../../utils";
import "tui-image-editor/dist/tui-image-editor.css";
import * as styles from "./index.module.scss";

class ImageEditor extends Component {
  state = {
    url: "https://1000fuye.oss-cn-beijing.aliyuncs.com/weixiaoyi.png",
    dataUrl: ""
  };

  componentDidMount() {
    const commonTheme = {
      // main icons
      "menu.normalIcon.path": "./svg/icon-d.svg",
      "menu.activeIcon.path": "./svg/icon-b.svg",
      "menu.disabledIcon.path": "./svg/icon-a.svg",
      "menu.hoverIcon.path": "./svg/icon-c.svg",
      // submenu icons
      "submenu.normalIcon.path": "./svg/icon-d.svg",
      "submenu.activeIcon.path": "./svg/icon-c.svg"
    };
    this.imageEditor = new ImageUIEditor("#tui-image-editor", {
      includeUI: {
        initMenu: "filter",
        theme: { ...blackTheme, ...commonTheme },
        uiSize: {
          minWidth: "900px",
          height: "700px"
        },
        menuBarPosition: "bottom"
      },
      cssMaxWidth: 700,
      cssMaxHeight: 400,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
      },
      usageStatistics: true
    });

    if (window) {
      bindWindow.loadImageFromUrl(this.loadImageFromUrl);
      bindWindow.exportImageDataUrl(this.exportImageDataUrl);
      bindWindow.exportImageDataUrlFromUrl(this.exportImageDataUrlFromUrl);
    }
  }

  loadImageFromUrl = (url, name = Date.now()) => {
    if (!url) return;
    return this.imageEditor
      .loadImageFromURL(url, name)
      .then(size => {
        this.imageEditor.ui.activeMenuEvent();
        this.imageEditor.ui.resizeEditor({ imageSize: size });
        return size;
      })
      .catch(this.catchError);
  };

  exportImageDataUrl = () => this.imageEditor.toDataURL();

  exportImageDataUrlFromUrl = async (url, name = Date.now()) => {
    const loadUrl = await this.loadImageFromUrl(url, name);
    if (loadUrl) {
      return this.exportImageDataUrl();
    } else if (typeof loadUrl === "undefined") {
      return this.catchError();
    }
  };

  catchError = err => {
    err && console.log(err);
    notification.open({
      message: "请求下载图片失败",
      description: "---imageEditor加载图片url失败"
    });
    return null;
  };

  render() {
    const { url, dataUrl } = this.state;
    return (
      <div>
        <div className={styles.utils}>
          <div className={styles.importUrl}>
            <input
              value={url}
              onChange={e => {
                this.setState({
                  url: e.target.value
                });
              }}
            />
            <button
              onClick={() => {
                this.loadImageFromUrl(url);
              }}
            >
              url导入
            </button>
          </div>
          <button
            className={styles.export}
            onClick={() => {
              const dataUrl = this.exportImageDataUrl();
              if (dataUrl && dataUrl.length) {
                this.setState({
                  dataUrl
                });
              }
            }}
          >
            导出
          </button>
          {dataUrl && <Clipboard className={styles.copy} text={dataUrl} />}
        </div>

        <div id="tui-image-editor" />
      </div>
    );
  }
}

export default ImageEditor;
