const injectJavaScript = () => {
  const div = document.createElement("div");
  div.innerHTML = `test`;
  document.body.appendChild(div);
  const url = window.location.href;
  const sellerInfo = document.getElementById("J_SellerInfo");
  const product = document.getElementById("J_Property");
  const otherWrap = document.querySelector("#idle-detail .others-wrap");

  const wangwang = sellerInfo.getElementsByClassName("wangwang")[0].innerText;
  const userVertify = sellerInfo.getElementsByClassName("user-verify")[0].title;
  const vip = sellerInfo.getElementsByClassName("vip-level")[0].title;

  const hot = document.querySelector("#J_Browse>span").innerText;
  const editTime = otherWrap.querySelector("li:nth-of-type(2)>span").innerText;
  const title = product.getElementsByTagName("h1")[0].innerText;
  const sellPrice = product.querySelector(
    ".price-info>li:nth-of-type(1) .price.big em"
  ).innerText;
  const prevPrice = product.querySelector(
    ".price-info>li:nth-of-type(2) span:last-child"
  ).innerText;

  const quality = product.querySelector(".idle-info>li:nth-of-type(1)>em")
    .innerText;
  const fromWhere = product.querySelector(".idle-info>li:nth-of-type(2)>em")
    .innerText;
  const wangwangAddress = product.querySelector(
    ".idle-info>li:nth-of-type(3) a.ww-online"
  ).href;
  const emailPrice = document.querySelector("#J_Carriage").innerText;

  const images =
    document.querySelectorAll("#J_Slider>ul.album>li img.big-img") || [];
  const desc = document.querySelector("#J_DescContent").innerText;

  window.ipc.send("ipc", {
    from: "app.wins.main.render",
    data: {
      type: "xianyu.get-product",
      message: {
        url,
        wangwang,
        userVertify,
        vip,
        title,
        hot,
        editTime,
        sellPrice,
        prevPrice,
        quality,
        fromWhere,
        wangwangAddress,
        emailPrice,
        images: Array.prototype.map.call(images, item => item.src),
        desc
      }
    }
  });
};

export default `
window.injectJavaScript=${injectJavaScript}
window.injectJavaScript()
`;
