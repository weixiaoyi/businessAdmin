import React, { Component } from "react";
import { Button, Tooltip } from "antd";
import classNames from "classnames";
import { Inject } from "../../utils";
import * as styles from "./preview.module.scss";
import { Clipboard } from "../../components";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class Preview extends Component {
  state = {
    links: []
  };

  componentDidMount() {
    this.parseLinks();
  }

  componentDidUpdate(prevProps) {
    const { content: contentPrev } = prevProps;
    const { content } = this.props;
    if (content && contentPrev !== content) {
      this.parseLinks();
    }
  }

  parseLinks = () => {
    const images = document
      .getElementById("answer-preview")
      .querySelectorAll("img");

    const links =
      images.length > 0
        ? Array.prototype.map.call(images, item => {
            const srcDefault =
              item.getAttribute("data-default-watermark-src") ||
              item.getAttribute("data-actualsrc") ||
              item.getAttribute("data-original");
            const srcLocal = item.getAttribute("src");
            const filename = srcLocal.replace(/.*\/(.*)\.jpg/g, "$1");
            return {
              srcDefault,
              srcLocal,
              filename
            };
          })
        : [];
    if (links && links.length) {
      this.setState({
        links
      });
    } else if (this.state.links.length) {
      this.setState({
        links: []
      });
    }
  };

  downloadImage = async (url, filename) => {
    const {
      model: { dispatch }
    } = this.props;
    const dataUrl =
      window.imageEditor && (await window.imageEditor.exportImageFromUrl(url));
    if (dataUrl && dataUrl.length) {
      dispatch({
        type: "ipc-download-image",
        payload: {
          dataUrl,
          filename
        }
      });
    }
  };

  render() {
    const { links } = this.state;
    const { content } = this.props;

    return (
      <div className={classNames(styles.preview, "image-update")}>
        {links.length > 0 && (
          <div className={styles.images}>
            <ul id="imageList-preview">
              {links.map((item, index) => (
                <li key={index}>
                  <div className={styles.imageContainer}>
                    <Tooltip title={item.srcDefault} placement="bottom">
                      <img
                        src={item.srcLocal}
                        onClick={() =>
                          this.downloadImage(item.srcDefault, item.filename)
                        }
                      />
                    </Tooltip>
                  </div>

                  <Clipboard
                    className={styles.clipboard}
                    text={item.filename}
                    width={40}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          id="answer-preview"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }
}

export default Preview;
