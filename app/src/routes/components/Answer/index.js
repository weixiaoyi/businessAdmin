import React, { Component } from "react";
import classNames from "classnames";
import * as styles from "./index.module.scss";

class Preview extends Component {
  render() {
    const { content, className } = this.props;
    return (
      <div
        className={classNames(styles.answerPreview, className)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
}

export default Preview;
