const path = require("path");
const { shell } = require("electron");
const {
  getScrapyDb,
  parseDataUrl2Image,
  ensureDir,
  outputFile,
  setDataPath
} = require("../utils");
const { PATH } = require("../constants");

// 下载图片
exports.download_image = async ({ dataUrl, filename, dir, success }) => {
  await ensureDir(dir);
  const result = await parseDataUrl2Image(
    dataUrl,
    path.join(dir, filename)
  ).catch(() => null);
  success && success(result);
};

exports.openPath = async ({ dir }) => {
  shell.openItem(dir);
};
