const { ipcRenderer } = require("electron");
window.ipc = ipcRenderer;
// setInterval(() => {
//   const t = document.body.clientHeight;
//   window.scrollTo({ top: t, left: 0, behavior: "smooth" });
// }, 3000);
