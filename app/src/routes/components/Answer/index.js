import React, { Component } from "react";
import * as styles from "./index.module.scss";

class Preview extends Component {
  render() {
    const { content } = this.props;
    return (
      <div
        className={styles.answerPreview}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
}

export default Preview;
