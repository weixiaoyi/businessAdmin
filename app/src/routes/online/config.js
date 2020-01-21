import React, { Component } from "react";
import classNames from "classnames";
import { Clipboard, OpenExternal } from "../../components";
import * as styles from "./config.module.scss";

const renderInfos = (infos, item, showVersion) => {
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
          {one.render ? one.render(one.name, item[one.value]) : item[one.value]}
        </li>
      ))}
    </ul>
  );
};

export default {
  namespaces: {
    xianyu: "xianyu"
  },
  websites: [
    {
      text: "淘宝",
      value: "淘宝",
      icon: "https://1000fuye.oss-cn-beijing.aliyuncs.com/taobao.png",
      renderDetail: item => {
        return item.remark && <div>备注：{item.remark}</div>;
      },
      renderInfo: (item, showVersion = false) => {
        let infos = [
          { name: "售价", value: "sellPrice" },
          { name: "原价", value: "prevPrice" },
          { name: "属性", value: "attrs" }
        ];
        if (showVersion) {
          infos = [
            { name: "title", value: "title" },
            { name: "productId", value: "productId" }
          ].concat(infos);
        }
        return renderInfos(infos, item, showVersion);
      }
    },
    {
      text: "京东",
      value: "京东",
      icon: "https://1000fuye.oss-cn-beijing.aliyuncs.com/jingdong.png",
      renderDetail: item => {
        return item.remark && <div>备注：{item.remark}</div>;
      },
      renderInfo: (item, showVersion = false) => {
        let infos = [
          { name: "售价", value: "sellPrice" },
          { name: "原价", value: "prevPrice" },
          { name: "属性", value: "attrs" }
        ];
        if (showVersion) {
          infos = [
            { name: "title", value: "title" },
            { name: "productId", value: "productId" }
          ].concat(infos);
        }
        return renderInfos(infos, item, showVersion);
      }
    },
    {
      text: "1688",
      value: "1688",
      icon: "https://1000fuye.oss-cn-beijing.aliyuncs.com/1688.png"
    },
    {
      text: "咸鱼",
      value: "咸鱼",
      icon: "https://1000fuye.oss-cn-beijing.aliyuncs.com/xianyu.png",
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
        return renderInfos(infos, item, showVersion);
      },
      renderDetail: item => {
        return (
          <span>
            {item.remark && <div>{item.remark}</div>}
            <Clipboard text={item.desc} short={false} />
          </span>
        );
      }
    }
  ]
};
