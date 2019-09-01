import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import claesNames from "classnames";
import { PATH } from "../constants";
import * as styles from "./index.module.scss";

class Home extends Component {
  render() {
    return (
      <div className={claesNames(styles.home, "page")}>
        <Card
          size="small"
          title="知乎爬虫"
          extra={<Link to={PATH.scrapy}>More</Link>}
          style={{ width: 300 }}
        >
          知乎爬虫
        </Card>
      </div>
    );
  }
}

export default Home;
