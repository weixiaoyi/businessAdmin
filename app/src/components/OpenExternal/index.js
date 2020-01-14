import React, { Component } from "react";

class OpenExternal extends Component {
  onClick = e => {
    const { href } = this.props;
    e.preventDefault();

    href && window.electron && window.electron.shell.openExternal(href);
  };
  render() {
    const { href, children } = this.props;
    return (
      <a href={href} onClick={this.onClick}>
        {children}
      </a>
    );
  }
}

export default OpenExternal;
