import React, { Component } from "react";
import { Drawer } from "antd";
import { ImageEditor } from "../../../components";
import * as styles from "./index.module.scss";

class GlobalUtils extends Component {
  state = {
    showFeature: "ImageEditor"
  };
  render() {
    const { showFeature } = this.state;
    const { onClose } = this.props;
    const buttons = [
      { name: "ImageEditor", desc: "导入图片截图", handler: () => {} }
    ];
    return (
      <Drawer
        width={1000}
        mask={false}
        getContainer={false}
        title="工具箱"
        placement={"right"}
        closable={true}
        visible={true}
        onClose={onClose}
      >
        <ul className={styles.buttons}>
          {buttons.map(item => (
            <li
              key={item.desc}
              onClick={item.handler && item.handler}
              className={showFeature === item.name ? styles.active : null}
            >
              {item.desc}
            </li>
          ))}
        </ul>
        <div
          style={{ display: showFeature === "ImageEditor" ? "block" : "none" }}
        >
          <ImageEditor />
        </div>
      </Drawer>
    );
  }
}

export default GlobalUtils;
