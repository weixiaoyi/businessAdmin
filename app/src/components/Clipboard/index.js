import React, { Component } from "react";
import { message } from "antd";
import ClipboardJS from "clipboard";
import _ from "lodash";
import classNames from "classnames";
import { copyIcon } from "../../svgs";
import * as styles from "./index.module.scss";

class Clipboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("copy_")
    };
  }

  componentDidMount() {
    const { id } = this.state;
    const clipboard = new ClipboardJS(`#${id}`);
    clipboard.on("success", () => {
      message.success("复制成功");
      this.props.success && this.props.success(this.props.text);
    });
    clipboard.on("error", () => message.error("复制失败"));
  }

  render() {
    const { id } = this.state;
    const { text, className, width = 100, style, short = true } = this.props;
    return text ? (
      <span
        id={id}
        data-clipboard-text={text}
        className={classNames(styles.copy, className)}
        style={style}
      >
        {short ? (
          <>
            <span className={styles.short} style={{ maxWidth: width }}>
              {text.slice(-100)}
            </span>
            <span className={styles.icon}>{copyIcon}</span>
          </>
        ) : (
          <span className={styles.normal}>
            {text}
            <span className={styles.icon}>{copyIcon}</span>
          </span>
        )}
      </span>
    ) : null;
  }
}

export default Clipboard;
