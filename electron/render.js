const { ipcRenderer } = require("electron");
window.ipcRenderer = ipcRenderer;
// setInterval(() => {
//   const t = document.body.clientHeight;
//   window.scrollTo({ top: t, left: 0, behavior: "smooth" });
// }, 3000);
