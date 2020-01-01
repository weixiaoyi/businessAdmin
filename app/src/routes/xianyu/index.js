import React, { Component } from "react";
import { Inject } from "../../utils";
import * as styles from "./index.module.scss";

@Inject(({ pdfStore: model }) => ({
  model
}))
class XianYu extends Component {
  componentDidMount() {}

  render() {
    return <div className={styles.xianyu}>咸鱼</div>;
  }
}

export default XianYu;
