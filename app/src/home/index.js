import React, { Component } from "react";
import * as styles from "./index.module.scss";

class Home extends Component {
  render() {
    console.log(styles.home, "---");
    return <div className={styles.home}>Hofffme</div>;
  }
}

export default Home;
