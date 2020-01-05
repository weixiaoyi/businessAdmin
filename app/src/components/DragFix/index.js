import React, { Component } from "react";
import _ from "lodash";
import Draggable from "react-draggable";
import Slider from "rc-slider";

import * as styles from "./index.module.scss";
import { localSave } from "../../utils";

class DragFix extends Component {
  constructor(props) {
    super(props);
    this.name = `drag_${props.name}`;
    const local = localSave.get(this.name) || {
      width: 400,
      height: 800,
      opacity: 1
    };
    this.state = {
      id: _.uniqueId("dragFix_"),
      show: true,
      width: local.width,
      height: local.height,
      opacity: local.opacity
    };
  }

  componentDidMount() {}

  onSliderChange = (property, v) => {
    this.setState({
      [property]: v
    });
    const local = localSave.get(this.name) || {};
    local[property] = v;
    localSave.set(this.name, local);
  };

  render() {
    const handleClass = styles.operationButton;
    const { width, height, opacity } = this.state;
    const sliderProps = {
      min: 200,
      max: 1900,
      onChange: this.onSliderChange
    };
    return (
      <Draggable handle={`.${handleClass}`} defaultPosition={{ x: 20, y: 0 }}>
        <div className={styles.drag}>
          <div className={handleClass}>信息</div>
          <div className={styles.content} style={{ width, height, opacity }}>
            <div className={styles.utils}>
              <div>
                宽度：
                <Slider
                  {...sliderProps}
                  value={width}
                  onChange={v => this.onSliderChange("width", v)}
                />
              </div>
              <div>
                高度：
                <Slider
                  {...sliderProps}
                  value={height}
                  min={50}
                  onChange={v => this.onSliderChange("height", v)}
                />
              </div>
              <div>
                透明度：
                <Slider
                  {...sliderProps}
                  value={opacity}
                  min={0.1}
                  max={1}
                  step={0.1}
                  onChange={v => this.onSliderChange("opacity", v)}
                />
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    );
  }
}

export default DragFix;
