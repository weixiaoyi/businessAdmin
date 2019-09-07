import React, { Component } from "react";
import { Drawer } from "antd";
import { ImageEditor } from "../../../components";

class GlobalUtils extends Component {
  render() {
    const { onClose } = this.props;
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
        <ImageEditor />
      </Drawer>
    );
  }
}

export default GlobalUtils;
