import React, { Component } from "react";
import _ from "lodash";

class Webview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("webview_")
    };
  }
  render() {
    const { id } = this.state;
    const { className, src, style } = this.props;
    return (
      <webview
        id={id}
        style={style}
        allowpopups={"true"}
        className={className}
        src={src}
      />
    );
  }
}

export default Webview;
