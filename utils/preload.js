const { ipcRenderer } = require("electron");
const path = require("path");

if (!window.ipc) {
  window.ipc = ipcRenderer;
  window.path = path;
}
if (!window.preloadUtils) {
  window.preloadUtils = {
    formatStyle: style => {
      const result = Object.entries(style).reduce((sum, item) => {
        const [key, value] = item;
        sum.push(`${key}:${value}`);
        return sum;
      }, []);
      return result.join(";");
    }
  };
}
