const formatStyle = window.preloadUtils.formatStyle;

const buttonStyle = {
  background: "red",
  margin: "10px",
  padding: "10px",
  color: "white"
};

const detailStyle = {
  background: "blue",
  padding: "5px",
  color: "white"
};

window.ipc.on("scrapy.preview-special-image", (e, args) => {
  console.log(args, "----args");
});
