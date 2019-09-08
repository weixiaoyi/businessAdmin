import React, { Component } from "react";
import { notification } from "antd";
import { Clipboard } from "../index";
import ImageUIEditor from "tui-image-editor";
import blackTheme from "./theme/black-theme";
import "tui-image-editor/dist/tui-image-editor.css";
import * as styles from "./index.module.scss";

class ImageEditor extends Component {
  state = {
    url:
      "http://47.91.249.41/pic.yijianxiazai.com/%E9%AB%98%E6%B8%85%E9%A3%8E%E6%99%AF%E5%A3%81%E7%BA%B8358P/118204.jpg",
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

    if (window && !window.imageEditor) {
      window.imageEditor = {
        loadImageFromUrl: this.loadImageFromUrl,
        exportImage: this.exportImage,
        exportImageFromUrl: this.exportImageFromUrl
      };
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

  exportImage = () => this.imageEditor.toDataURL();

  exportImageFromUrl = (url, name = Date.now()) =>
    this.loadImageFromUrl(url, name)
      .then(res => (res ? this.exportImage() : null))
      .catch(this.catchError);

  catchError = err => {
    console.log(err);
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
              const dataUrl = this.exportImage();
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
