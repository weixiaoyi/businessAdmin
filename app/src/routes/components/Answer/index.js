import React, { Component } from "react";
import classNames from "classnames";
import * as styles from "./index.module.scss";

class Preview extends Component {
  render() {
    const { content, authorName, className, ins } = this.props;
    return (
      <div>
        <div className={styles.answerHeader}>
          <div className={styles.authorName}>
            {ins && <div className={styles.ins}>{ins}</div>}
            {authorName}
            <span style={{ marginLeft: 5 }}>的分享</span>
          </div>
        </div>

        <div
          className={classNames(styles.answerPreview, className)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }
}

export default Preview;
