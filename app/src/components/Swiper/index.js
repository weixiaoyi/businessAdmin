import React, { Component } from "react";
import _ from "lodash";
import { default as SwiperPrev } from "swiper";
import classNames from "classnames";
import * as styles from "./index.module.scss";

class Swiper extends Component {
  state = {
    id: _.uniqueId("swiper_")
  };

  componentDidMount() {
    const { id } = this.state;
    new SwiperPrev(`#${id}`, {
      loop: true, // 循环模式选项
      autoplay: {
        delay: 2000,
        stopOnLastSlide: false,
        disableOnInteraction: true
      }
    });
  }

  render() {
    const { id } = this.state;
    const { className, children, data = [], prevNext } = this.props;
    return (
      <div id={id} className={classNames("swiper-container", className)}>
        <div className="swiper-wrapper">
          {data.map((item, index) => (
            <div className="swiper-slide" key={index}>
              <img src={item.src} />
            </div>
          ))}
        </div>
        {prevNext && (
          <>
            <div className="swiper-button-prev" />
            <div className="swiper-button-next" />
          </>
        )}
      </div>
    );
  }
}

export default Swiper;
