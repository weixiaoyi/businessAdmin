import React, { Component } from "react";

const injectJavaScript = () => {
  const div = document.createElement("div");
  div.innerHTML = `test`;
  document.body.appendChild(div);
  const url = window.location.href;
  const sellerInfo = document.getElementById("J_SellerInfo");
  const wangwang = sellerInfo.getElementsByClassName("wangwang")[0].innerText;
  const userVertify = sellerInfo.getElementsByClassName("user-verify")[0].title;
  const vip = sellerInfo.getElementsByClassName("vip-level")[0].title;
  // const sex = sellerInfo.getElementsByClassName("basic-info")[0].get;
  window.ipc.send("ipc", {
    from: "app.wins.main.render",
    data: {
      type: "xianyu.get-product",
      message: {
        url,
        sellerInfo: {
          wangwang,
          userVertify,
          vip
        }
      }
    }
  });
};

export default `
window.injectJavaScript=${injectJavaScript}
window.injectJavaScript()
`;
