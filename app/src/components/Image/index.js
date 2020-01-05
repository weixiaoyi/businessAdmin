import React, { Component } from "react";
import { Icon } from "antd";
import _ from "lodash";
import * as styles from "./index.module.scss";

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("img_")
    };
  }

  downloadImage = async (url, filename) => {
    const dataUrl =
      window.imageEditor &&
      (await window.imageEditor.exportImageDataUrlFromUrl(url));
    if (dataUrl && dataUrl.length) {
      this.props.download(dataUrl, filename);
    }
  };

  render() {
    const { src, filename, className, download } = this.props;
    return (
      <div className={styles.img}>
        <img src={src} className={className} alt={filename} />
        <div className={styles.utils}>
          {download && (
            <Icon
              type="download"
              onClick={() => this.downloadImage(src, filename)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Image;
