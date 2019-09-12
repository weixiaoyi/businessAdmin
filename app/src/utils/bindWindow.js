export const bindWindow = (() => {
  if (window && !window.imageEditor) window.imageEditor = {};
  return {
    loadImageFromUrl: fun => (window.imageEditor.loadImageFromUrl = fun),
    exportImageDataUrl: fun => (window.imageEditor.exportImageDataUrl = fun),
    exportImageDataUrlFromUrl: fun =>
      (window.imageEditor.exportImageDataUrlFromUrl = fun)
  };
})();
