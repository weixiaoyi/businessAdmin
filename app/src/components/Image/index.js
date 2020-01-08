import React, { Component } from "react";
import { Icon } from "antd";
import Viewer from "viewerjs";
import _ from "lodash";
import * as styles from "./index.module.scss";

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("img_")
    };
  }

  componentDidMount() {
    const { viewer = true } = this.props;
    if (viewer) {
      new Viewer(document.getElementById(this.state.id));
    }
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
    const { id } = this.state;
    const { src, filename, className, download, width, height } = this.props;
    return (
      <div className={styles.img}>
        <img
          id={id}
          src={src}
          className={className}
          alt={filename}
          width={width}
          height={height}
        />
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
