const injectJavaScript = () => {
  const tryFind = fun => {
    if (fun) {
      try {
        return fun();
      } catch (e) {
        console.log(e, fun, "-----------------出错了");
        return "";
      }
    }
    return "";
  };

  const getUrl = url => {
    if (
      url &&
      !(
        url.substr(0, 7).toLowerCase() === "http://" ||
        url.substr(0, 8).toLowerCase() === "https://"
      )
    ) {
      return "https://" + url;
    }
    return url;
  };
  const url = window.injectSrc;
  if (window.injectWebsite === "咸鱼") {
    const productId = url.replace(/.*id=(.*)$/g, "$1");
    let title = "";
    let sellPrice = "";
    let prevPrice = "";
    let editTime = "";
    let wangwang = "";
    let wangwangPersonCenter = "";
    let wangwangAddress = "";
    let desc = "";
    let hot = "";
    let images = "";
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
      wangwangPersonCenter = tryFind(() =>
        getUrl(sellerInfo.querySelector(".wangwang>a").href)
      );
      const userVertify = tryFind(
        () => sellerInfo.getElementsByClassName("user-verify")[0].title
      );
      const vip = tryFind(
        () => sellerInfo.getElementsByClassName("vip-level")[0].title
      );
      hot = tryFind(() => document.querySelector("#J_Browse>span").innerText);
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
      images = tryFind(
        () =>
          document.querySelectorAll("#J_Slider>ul.album>li img.big-img") || []
      );
      desc = tryFind(() => document.querySelector("#J_DescContent").innerText);
      wangwangAddress = tryFind(() =>
        getUrl(
          product.querySelector(".idle-info>li:nth-of-type(3) a.ww-online").href
        )
      );

      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.get-product",
          message: {
            url,
            productId,
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
              ? Array.prototype.map.call(images, item => {
                  const url = item.getAttribute("lazyload-img") || item.src;
                  return getUrl(url);
                })
              : [],
            desc
          }
        }
      });
    } catch (e) {
      let offSell = tryFind(
        () => document.querySelector("#J_Property>.off-sell>h4").innerText
      );
      if (
        !offSell &&
        (!title || !sellPrice || !editTime || !hot || !wangwang)
      ) {
        offSell = "未获取到必要信息";
      }
      window.ipc.send("ipc", {
        from: "app.wins.main.render",
        data: {
          type: "online.get-product",
          message: {
            url,
            productId,
            title,
            sellPrice,
            prevPrice,
            editTime,
            hot,
            wangwang,
            wangwangAddress,
            wangwangPersonCenter,
            desc,
            images,
            errMsg: offSell || "获取信息错误"
          }
        }
      });
    }
  } else if (window.injectWebsite === "淘宝") {
    return {
      url
    };
  } else if (window.injectWebsite === "京东") {
    const productId = url.replace(/.*\/(.*?).html/g, "$1");
    const title = document.querySelector(".itemInfo-wrap .sku-name").innerText;
    const sellPrice = document.querySelector(".summary-price .p-price>.price")
      .innerText;
    const prevPrice = tryFind(
      () => document.querySelector("#page_hx_price").innerText
    );
    const images = document.querySelectorAll("#J-detail-content img");
    const previews = document.querySelectorAll("#spec-list img");
    window.ipc.send("ipc", {
      from: "app.wins.main.render",
      data: {
        type: "online.get-product",
        message: {
          url,
          productId,
          title,
          sellPrice,
          prevPrice,
          images: images
            ? Array.prototype.map.call(images, item => {
                const url = item.getAttribute("data-lazyload") || item.src;
                return getUrl(url);
              })
            : [],
          previews: previews
            ? Array.prototype.map.call(previews, item => {
                const url = item.src;
                return getUrl(url);
              })
            : []
        }
      }
    });
  }
};

const onLoad = (src, website) => {
  const inject = injectJavaScript;
  return ` 
  window.injectWebsite='${website}'
  window.injectSrc='${src}'
  window.injectJavaScript=${inject} 
  window.injectJavaScript()
    `;
};

export default onLoad;
