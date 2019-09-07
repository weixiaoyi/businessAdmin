import React, { Component } from "react";
import ImageUIEditor from "tui-image-editor";
import blackTheme from "./theme/black-theme";
import "tui-image-editor/dist/tui-image-editor.css";
import * as styles from "./index.module.scss";

class ImageEditor extends Component {
  state = {
    url: ""
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
          width: "900px",
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
        exportImage: this.exportImage
      };
    }
  }

  loadImageFromUrl = (url, name = Date.now()) => {
    if (!url) return;
    this.imageEditor
      .loadImageFromURL(url, name)
      .then(size => {
        this.imageEditor.ui.activeMenuEvent();
        this.imageEditor.ui.resizeEditor({ imageSize: size });
      })
      .catch(err => {
        console.log(err, "---imageEditor加载图片url失败");
      });
  };

  exportImage = () => {
    return this.imageEditor.toDataURL();
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
