import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import classNames from "classnames";
import { PATH } from "../../constants";
import * as styles from "./index.module.scss";

class Home extends Component {
  render() {
    return (
      <div className={classNames(styles.home, "page")}>
        <div className={styles.navs}>
          <Card
            size="small"
            title="知乎爬虫"
            extra={<Link to={PATH.scrapy}>More</Link>}
          >
            知乎爬虫
          </Card>
          <Card
            size="small"
            title="知乎爬虫"
            extra={<Link to={PATH.scrapyPdf}>More</Link>}
          >
            pdf
          </Card>
        </div>
      </div>
    );
  }
}

export default Home;
