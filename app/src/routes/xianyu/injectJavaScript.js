import React, { Component } from "react";

const injectJavaScript = () => {
  const div = document.createElement("div");
  div.innerHTML = `test`;
  document.body.appendChild(div);
  const url = window.location.href;
  const seller = document
    .getElementById("J_SellerInfo")
    .getElementsByClassName("wangwang")[0].innerText;
  window.ipc.send("ipc", {
    from: "app.wins.main.render",
    data: {
      type: "xianyu.get-product",
      message: {
        url,
        seller
      }
    }
  });
};

export default `
window.injectJavaScript=${injectJavaScript}
window.injectJavaScript()
`;
