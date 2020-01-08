const { createWindow } = require("./widget");
const { parseDataUrl2Image, setDataPath } = require("./helper");
const { getScrapyDb, setPreloadFile, getXianyuDb } = require("./db");
const { ensureDir, outputFile } = require("./fsExtra");

module.exports = {
  createWindow,
  parseDataUrl2Image,
  setDataPath,
  getScrapyDb,
  getXianyuDb,
  setPreloadFile,
  ensureDir,
  outputFile
};
