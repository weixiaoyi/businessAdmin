import React, { Component } from "react";
import { Card, Icon } from "antd";
import _ from "lodash";
import classNames from "classnames";
import * as styles from "./index.module.scss";

class FullScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: _.uniqueId("fullScreen_"),
      fullScreen: false
    };
  }

  componentDidMount() {}

  fullScreen = docElm => {
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    }
    this.setState({
      fullScreen: true
    });
  };

  closeFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    this.setState({
      fullScreen: false
    });
  };

  render() {
    const { id, fullScreen } = this.state;
    const {
      className,
      title = "title",
      width = 300,
      height,
      children
    } = this.props;
    return (
      <div
        style={{ width, height: fullScreen ? "100%" : height }}
        className={classNames(fullScreen && styles.fullScreen, className)}
        id={id}
      >
        <Card
          title={title}
          extra={
            fullScreen ? (
              <Icon
                type="fullscreen-exit"
                onClick={() => {
                  this.closeFullScreen(document.getElementById(id));
                }}
              />
            ) : (
              <Icon
                type="fullscreen"
                onClick={() => {
                  this.fullScreen(document.getElementById(id));
                }}
              />
            )
          }
        >
          {children}
        </Card>
      </div>
    );
  }
}

export default FullScreen;
