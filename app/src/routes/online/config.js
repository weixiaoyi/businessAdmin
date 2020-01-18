import React, { Component } from "react";
import classNames from "classnames";
import { Clipboard, OpenExternal } from "../../components";
import * as styles from "./config.module.scss";

export default {
  namespaces: {
    xianyu: "xianyu"
  },
  websites: [
    {
      text: "淘宝",
      value: "淘宝",
      icon: ""
    },
    { text: "京东", value: "京东", icon: "" },
    { text: "1688", value: "1688", icon: "" },
    {
      text: "咸鱼",
      value: "咸鱼",
      icon: "",
      renderInfo: (item, showVersion = false) => {
        let infos = [
          { name: "售价", value: "sellPrice" },
          { name: "原价", value: "prevPrice" },
          { name: "编辑时间", value: "editTime" },
          { name: "浏览", value: "hot" },
          { name: "成色", value: "quality" },
          { name: "vip", value: "vip" },
          { name: "实名认证", value: "userVertify" }
        ];
        if (showVersion) {
          infos = [
            { name: "title", value: "title" },
            { name: "productId", value: "productId" }
          ]
            .concat(infos)
            .concat(
              { name: "wangwang", value: "wangwang" },
              {
                name: "主页",
                value: "wangwangPersonCenter",
                render: (name, value) => (
                  <span>
                    <OpenExternal href={value}>前往</OpenExternal>
                    <Clipboard className={styles.personCenter} text={value} />
                  </span>
                )
              },
              { name: "desc", value: "desc" }
            );
        }
        return (
          <ul
            className={classNames(
              styles.short,
              showVersion ? styles.showVersion : ""
            )}
          >
            {infos.map(one => (
              <li key={one.name}>
                <span>{one.name}: </span>
                {one.render
                  ? one.render(one.name, item[one.value])
                  : item[one.value]}
              </li>
            ))}
          </ul>
        );
      },
      renderDetail: item => {
        return <Clipboard text={item.desc} short={false} />;
      }
    }
  ]
};
