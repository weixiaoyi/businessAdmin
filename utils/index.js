const { createWindow } = require("./widget");
const { parseDataUrl2Image, setDataPath } = require("./helper");
const {
  getScrapyDb,
  setPreloadFile,
  getXianyuImageDb,
  getXianyuVersionDb,
  getXianyuProductDb
} = require("./db");
const { ensureDir, outputFile } = require("./fsExtra");

module.exports = {
  createWindow,
  parseDataUrl2Image,
  setDataPath,
  getScrapyDb,
  getXianyuImageDb,
  getXianyuVersionDb,
  getXianyuProductDb,
  setPreloadFile,
  ensureDir,
  outputFile
};
