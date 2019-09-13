import React, { Component } from "react";
import * as styles from "./index.module.scss";

class GlobalUtilsQuick extends Component {
  render() {
    const features = [
      {
        name: "screenShot",
        desc: "截",
        handler: () => {}
      }
    ];
    return (
      <ul className={styles.entries}>
        {features.map(item => (
          <li key={item.desc} onClick={item.handler && item.handler}>
            {item.desc}
          </li>
        ))}
      </ul>
    );
  }
}

export default GlobalUtilsQuick;
