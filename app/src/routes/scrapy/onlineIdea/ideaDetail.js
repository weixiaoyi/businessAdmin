import React, { Component } from "react";
import _ from "lodash";
import { Inject } from "../../../utils";
import * as styles from "./ideaDetail.module.scss";

@Inject(({ onlineStore: model }) => ({
  model
}))
class IdeaDetail extends Component {
  render() {
    const {
      model: { ideaDetail }
    } = this.props;
    return (
      <ul className={styles.detail}>
        {[
          { name: "_id", value: ideaDetail._id },
          { name: "发布者id", value: _.get(ideaDetail, "popUser._id") },
          { name: "发布者名称", value: _.get(ideaDetail, "popUser.name") },
          { name: "标题", value: _.get(ideaDetail, "title") },
          {
            name: "content",
            value: (
              <div dangerouslySetInnerHTML={{ __html: ideaDetail.content }} />
            )
          }
        ].map(item => (
          <li key={item.name} className={styles.item}>
            <div className={styles.name}>{item.name}</div>
            {item.value}
          </li>
        ))}
      </ul>
    );
  }
}

export default IdeaDetail;
