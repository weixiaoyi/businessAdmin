const injectJavaScript = () => {
  const tryFind = fun => {
    if (fun) {
      try {
        return fun();
      } catch (e) {
        console.log(e, url, fun, "-----------------出错了");
        return "";
      }
    }
    return "";
  };
  const url = window.injectSrc;
  let title = "";
  let sellPrice = "";
  let prevPrice = "";
  let editTime = "";
  let wangwang = "";
  let wangwangPersonCenter = "";
  let wangwangAddress = "";
  let desc = "";
  try {
    const div = document.createElement("div");
    div.innerHTML = `test`;
    document.body.appendChild(div);

    const sellerInfo = document.getElementById("J_SellerInfo");
    const product = document.getElementById("J_Property");
    const otherWrap = document.querySelector("#idle-detail .others-wrap");

    title = tryFind(() => product.getElementsByTagName("h1")[0].innerText);
    wangwang = tryFind(
      () => sellerInfo.getElementsByClassName("wangwang")[0].innerText
    );
    wangwangPersonCenter = tryFind(
      () => sellerInfo.querySelector(".wangwang>a").href
    );
    const userVertify = tryFind(
      () => sellerInfo.getElementsByClassName("user-verify")[0].title
    );
    const vip = tryFind(
      () => sellerInfo.getElementsByClassName("vip-level")[0].title
    );
    const hot = tryFind(
      () => document.querySelector("#J_Browse>span").innerText
    );
    editTime = tryFind(
      () => otherWrap.querySelector("li:nth-of-type(2)>span").innerText
    );
    sellPrice = tryFind(
      () =>
        product.querySelector(".price-info>li:nth-of-type(1) .price.big em")
          .innerText
    );
    prevPrice = tryFind(
      () =>
        product.querySelector(".price-info>li:nth-of-type(2) span:last-child")
          .innerText
    );
    const quality = tryFind(
      () => product.querySelector(".idle-info>li:nth-of-type(1)>em").innerText
    );
    const fromWhere = tryFind(
      () => product.querySelector(".idle-info>li:nth-of-type(2)>em").innerText
    );
    const emailPrice = tryFind(
      () => document.querySelector("#J_Carriage").innerText
    );
    const images = tryFind(
      () => document.querySelectorAll("#J_Slider>ul.album>li img.big-img") || []
    );
    desc = tryFind(() => document.querySelector("#J_DescContent").innerText);
    wangwangAddress = tryFind(
      () =>
        product.querySelector(".idle-info>li:nth-of-type(3) a.ww-online").href
    );

    window.ipc.send("ipc", {
      from: "app.wins.main.render",
      data: {
        type: "xianyu.get-product",
        message: {
          url,
          wangwang,
          wangwangPersonCenter,
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
          images: images
            ? Array.from(
                new Set(
                  Array.prototype.map.call(
                    images,
                    item => item.getAttribute("lazyload-img") || item.src
                  )
                )
              )
            : [],
          desc
        }
      }
    });
  } catch (e) {
    const offSell = tryFind(
      () => document.querySelector("#J_Property>.off-sell>h4").innerText
    );
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
