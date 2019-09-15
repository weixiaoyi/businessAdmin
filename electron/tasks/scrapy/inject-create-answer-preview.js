const formatStyle = window.preloadUtils.formatStyle;

const buttonStyle = {
  background: "red",
  margin: "10px",
  padding: "10px",
  color: "white"
};

const imageStyle = {
  "max-height": "400px"
};

window.ipc.on("scrapy.createUtils", () => {
  const div = document.createElement("div");
  const content = `
<div id="electron-utils" style=${formatStyle({
    position: "fixed",
    top: "0",
    background: "rgba(0,0,0,.6)",
    "z-index": "10000",
    "min-height": "50px",
    "max-height": "800px",
    overflow: "auto",
    color: "white"
  })}>
<button style=${formatStyle(buttonStyle)}  id="showImages" >显示图片</button>
<button style=${formatStyle(buttonStyle)}  id="hideImages" >隐藏图片</button>
<div id="imagePreview"></div>
</div>
`;
  try {
    div.innerHTML = `${content}`;
    document.body.appendChild(div);
    const showImages = document.getElementById("showImages");
    const hideImages = document.getElementById("hideImages");

    showImages.onclick = () => {
      document.getElementById("imagePreview").innerHTML = "";
      const images = document
        .querySelectorAll(".RichContent")[0]
        .querySelectorAll("img");
      const imagesStr = Array.prototype.reduce.call(
        images,
        (strings, item) => {
          return `${strings}<img style=${formatStyle(
            imageStyle
          )} src=${item.getAttribute("data-actualsrc") ||
            item.getAttribute("data-actualsrc") ||
            item.getAttribute("src")} />`;
        },
        ""
      );
      document.getElementById("imagePreview").innerHTML = imagesStr;
    };

    hideImages.onclick = () => {
      if (document.getElementById("imagePreview")) {
        document.getElementById("imagePreview").innerHTML = "";
      }
    };
  } catch (e) {
    console.log(e);
  }
});
