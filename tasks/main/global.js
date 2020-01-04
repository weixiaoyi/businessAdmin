const path = require("path");
const { shell } = require("electron");
const {
  getScrapyDb,
  parseDataUrl2Image,
  ensureDir,
  outputFile,
  setDataPath
} = require("../../utils");
const { setPreloadFile } = require("../../utils");

exports.config = async ({ args, win }) => {
  const preloadJsPath = await setPreloadFile();
  win.webContents.send("global.config", {
    preloadJsPath
  });
};
