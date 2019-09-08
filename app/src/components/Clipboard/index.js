import React, { Component } from "react";
import { message } from "antd";
import ClipboardJS from "clipboard";
import _ from "lodash";
import classNames from "classnames";
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
    clipboard.on("success", () => message.success("复制成功"));
    clipboard.on("error", () => message.error("复制失败"));
  }

  render() {
    const { id } = this.state;
    const { text, className, width = 100 } = this.props;
    return (
      <span
        id={id}
        data-clipboard-text={text}
        className={classNames(styles.copy, className)}
      >
        <span className={styles.text} style={{ maxWidth: width }}>
          {text.slice(-100)}
        </span>
        复制
      </span>
    );
  }
}

export default Clipboard;
