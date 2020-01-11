const injectJavaScript = () => {
  const url = window.injectSrc;
  let title = "";
  let sellPrice = "";
  let prevPrice = "";
  let editTime = "";
  try {
    const div = document.createElement("div");
    div.innerHTML = `test`;
    document.body.appendChild(div);
    const sellerInfo = document.getElementById("J_SellerInfo");
    const product = document.getElementById("J_Property");
    const otherWrap = document.querySelector("#idle-detail .others-wrap");

    title = product.getElementsByTagName("h1")[0].innerText;
    const wangwang = sellerInfo.getElementsByClassName("wangwang")[0].innerText;
    const userVertify = sellerInfo.getElementsByClassName("user-verify")[0]
      .title;
    const vip = sellerInfo.getElementsByClassName("vip-level")[0].title;

    const hot = document.querySelector("#J_Browse>span").innerText;
    editTime = otherWrap.querySelector("li:nth-of-type(2)>span").innerText;

    sellPrice = product.querySelector(
      ".price-info>li:nth-of-type(1) .price.big em"
    ).innerText;

    prevPrice = (() => {
      const prev = product.querySelector(
        ".price-info>li:nth-of-type(2) span:last-child"
      );
      return prev ? prev.innerText : "";
    })();

    const quality = product.querySelector(".idle-info>li:nth-of-type(1)>em")
      .innerText;
    const fromWhere = product.querySelector(".idle-info>li:nth-of-type(2)>em")
      .innerText;

    const emailPrice = document.querySelector("#J_Carriage").innerText;

    const images =
      document.querySelectorAll("#J_Slider>ul.album>li img.big-img") || [];
    const desc = document.querySelector("#J_DescContent").innerText;
    const wangwangAddress = product.querySelector(
      ".idle-info>li:nth-of-type(3) a.ww-online"
    ).href;

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
          images: Array.from(
            new Set(
              Array.prototype.map.call(
                images,
                item => item.getAttribute("lazyload-img") || item.src
              )
            )
          ),
          desc
        }
      }
    });
  } catch (e) {
    console.log(e, url, "-------------------e");
    let offSell = "";
    try {
      offSell = document.querySelector("#J_Property>.off-sell>h4").innerText;
    } catch {}
    window.ipc.send("ipc", {
      from: "app.wins.main.render",
      data: {
        type: "xianyu.get-product",
        message: {
          url,
          title,
          sellPrice,
          prevPrice,
          editTime,
          errMsg: offSell || "获取信息错误"
        }
      }
    });
  }
};

const onLoad = src => {
  return ` 
  window.injectSrc='${src}'
  window.injectJavaScript=${injectJavaScript} 
  window.injectJavaScript()
    `;
};

export default onLoad;
