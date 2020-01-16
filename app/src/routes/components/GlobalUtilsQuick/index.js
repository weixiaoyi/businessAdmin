import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon } from "antd";

import * as styles from "./index.module.scss";
import { PATH } from "../../../constants";

class GlobalUtilsQuick extends Component {
  render() {
    const features = [
      {
        name: "screenShot",
        desc: (
          <Link to={PATH.home}>
            <Icon type="home" />
          </Link>
        )
      }
    ];
    return (
      <ul className={styles.entries}>
        {features.map(item => (
          <li key={item.desc} onClick={() => item.onClick && item.onClick()}>
            {item.desc}
          </li>
        ))}
      </ul>
    );
  }
}

export default GlobalUtilsQuick;
