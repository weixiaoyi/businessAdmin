import React, { Component } from "react";
import { Button, Tooltip } from "antd";
import { Inject } from "../../utils";
import * as styles from "./preview.module.scss";

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
            const src = item.getAttribute("data-default-watermark-src");
            const srcLocal = src.replace(/.*\/(.*\.jpg|png)/g, "$1");
            const filename = src.replace(/.*\/(.*)\.jpg|png/g, "$1");
            return {
              src,
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

  render() {
    const { links } = this.state;
    const {
      content,
      model: { dispatch }
    } = this.props;

    return (
      <div className={styles.preview}>
        {links.length > 0 && (
          <div className={styles.images}>
            <ul>
              {links.map((item, index) => (
                <li
                  key={index}
                  onClick={async () => {
                    const dataUrl =
                      window.imageEditor &&
                      (await window.imageEditor.exportImageFromUrl(item.src));
                    if (dataUrl && dataUrl.length) {
                      dispatch({
                        type: "ipc-download-image",
                        payload: {
                          dataUrl,
                          filename: item.filename
                        }
                      });
                    }
                  }}
                >
                  <Tooltip title={item.src} placement="bottom">
                    <img src={item.srcLocal} />
                  </Tooltip>
                  ,
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
