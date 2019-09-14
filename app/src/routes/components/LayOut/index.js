import React, { Component } from "react";
import { GlobalUtils, GlobalUtilsQuick } from "../index";
import * as styles from "./index.module.scss";

class LayOut extends Component {
  state = {
    visible: false
  };

  onClose = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;
    return (
      <div className="App">
        <div className={styles.layout}>
          <div className={styles.leftSidebar}>
            <GlobalUtilsQuick />
          </div>
          <div className={styles.content}>{this.props.children}</div>
        </div>
        <div className={styles.utils}>
          <div
            className={styles.desc}
            onClick={() => {
              this.setState({
                visible: !visible
              });
            }}
          >
            App
          </div>
          <div style={{ display: visible ? "block" : "none" }}>
            <GlobalUtils onClose={this.onClose} />
          </div>
        </div>
      </div>
    );
  }
}

export default LayOut;
