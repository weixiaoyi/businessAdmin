const electron = require("electron");
const path = require("path");

if (!window.ipc) {
  window.ipc = electron.ipcRenderer;
  window.path = path;
  window.electron = electron;
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
