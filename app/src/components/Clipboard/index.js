import React, { Component } from "react";
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
    new ClipboardJS(`#${id}`);
  }

  render() {
    const { id } = this.state;
    const { text, className } = this.props;
    return (
      <span
        id={id}
        data-clipboard-text={text}
        className={classNames(styles.copy, className)}
      >
        复制
      </span>
    );
  }
}

export default Clipboard;
