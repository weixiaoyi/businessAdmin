import React, { Component } from "react";
import { Switch } from "antd";
import * as styles from "./index.module.scss";

class MySwitch extends Component {
  state = {
    checked: false
  };

  onChange = checked => {
    this.setState({
      checked
    });
  };

  render() {
    const { checked } = this.state;
    const { className, children, defaultChecked } = this.props;
    return (
      <div className={className}>
        <Switch defaultChecked={defaultChecked} onChange={this.onChange} />
        {checked && children}
      </div>
    );
  }
}

export default MySwitch;
