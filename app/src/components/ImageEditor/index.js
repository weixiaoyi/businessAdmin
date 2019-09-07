import React, { Component } from "react";
import ImageUIEditor from "tui-image-editor";
import blackTheme from "./theme/black-theme";
import "tui-image-editor/dist/tui-image-editor.css";
import * as styles from "./index.module.scss";

class ImageEditor extends Component {
  state = {
    url:
      "http://47.91.249.41/pic.yijianxiazai.com/%E9%AB%98%E6%B8%85%E9%A3%8E%E6%99%AF%E5%A3%81%E7%BA%B8358P/118204.jpg"
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
      })
      .catch(err => {
        console.log(err, "---imageEditor加载图片url失败");
      });
  };

  exportImage = () => this.imageEditor.toDataURL();

  exportImageFromUrl = (url, name = Date.now()) => {
    this.loadImageFromUrl(url, name)
      .then(() => this.exportImage())
      .catch(err => {
        console.log(err, "---imageEditor加载图片url失败");
      });
  };

  render() {
    const { url } = this.state;
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
          <button className={styles.export} onClick={this.exportImage}>
            导出
          </button>
        </div>

        <div id="tui-image-editor" />
      </div>
    );
  }
}

export default ImageEditor;
