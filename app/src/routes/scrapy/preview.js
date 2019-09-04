import React, { Component } from "react";
import { Inject } from "../../utils";
import * as styles from "./preview.scss";

@Inject(({ scrapyStore: model }) => ({
  model
}))
class Preview extends Component {
  render() {
    const { content } = this.props;

    return (
      <div className={styles.preview}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }
}

export default Preview;
