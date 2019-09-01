const { ipcRenderer } = require("electron");
if (!window.ipc) {
  window.ipc = ipcRenderer;
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
