const { ipcRenderer } = require("electron");
window.ipc = ipcRenderer;
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
