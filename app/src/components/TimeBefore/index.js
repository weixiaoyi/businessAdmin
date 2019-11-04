import React, { Component } from "react";
import moment from "moment";
import { formatTime } from "../../utils";

moment.locale("zh-cn", {
  relativeTime: {
    future: "几秒前",
    past: "%s前",
    s: "几秒",
    m: "1分钟",
    mm: "%d分钟",
    h: "1小时",
    hh: "%d小时",
    d: "1天",
    dd: "%d天",
    M: "1个月",
    MM: "%d个月",
    y: "1年",
    yy: "%d年"
  }
});

class TimeBefore extends Component {
  render() {
    const { time } = this.props;
    const diff = moment(Date.now()).diff(moment(time), "days");
    return (
      <span>
        {diff > 7
          ? formatTime(time)
          : time
          ? moment(time).fromNow()
          : formatTime(time)}
      </span>
    );
  }
}

export default TimeBefore;
