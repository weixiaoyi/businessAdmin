const { createWindow } = require("./widget");
const { parseDataUrl2Image, setDataPath } = require("./helper");
const {
  getScrapyDb,
  setPreloadFile,
  getOnlineImageDb,
  getOnlineVersionDb,
  getOnlineProductDb
} = require("./db");
const { ensureDir, outputFile } = require("./fsExtra");

module.exports = {
  createWindow,
  parseDataUrl2Image,
  setDataPath,
  getScrapyDb,
  getOnlineImageDb,
  getOnlineVersionDb,
  getOnlineProductDb,
  setPreloadFile,
  ensureDir,
  outputFile
};
