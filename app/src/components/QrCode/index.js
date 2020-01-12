import React, { Component } from "react";
import { Icon, Tooltip } from "antd";
import QRCode from "qrcode";
import _ from "lodash";

class QrCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("qrcode_"),
      dataUrl: ""
    };
  }

  async componentDidMount() {
    const { url } = this.props;
    const dataUrl = await QRCode.toDataURL(url);
    this.setState({
      dataUrl
    });
  }

  render() {
    const { dataUrl } = this.state;
    return (
      <Tooltip placement="topLeft" title={dataUrl ? <img src={dataUrl} /> : ""}>
        <Icon type="qrcode" />
      </Tooltip>
    );
  }
}

export default QrCode;
