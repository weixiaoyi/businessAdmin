const formatStyle = window.preloadUtils.formatStyle;
const buttonStyle = {
  background: "red",
  margin: "10px",
  padding: "10px",
  color: "white"
};

window.ipc.on("createUtils", () => {
  const div = document.createElement("div");
  const content = `<div style=${formatStyle({
    position: "fixed",
    top: "0",
    background: "rgba(0,0,0,.6)",
    "z-index": "10000"
  })}><button style=${formatStyle(
    buttonStyle
  )}  id="start" >开始</button><button id="end" style=${formatStyle(
    buttonStyle
  )}>结束</button></div>`;
  div.innerHTML = `${content}`;
  document.body.appendChild(div);
  document.getElementById("start").onclick = () => {
    clearInterval(window.interval);
    window.interval = setInterval(() => {
      const t = document.body.clientHeight;
      window.scrollTo({ top: t, left: 0, behavior: "smooth" });
    }, 3000);
  };
  document.getElementById("end").onclick = () => {
    clearInterval(window.interval);
  };
});
