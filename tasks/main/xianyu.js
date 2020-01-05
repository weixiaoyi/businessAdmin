const path = require("path");
const { shell } = require("electron");
const {
  getScrapyDb,
  parseDataUrl2Image,
  ensureDir,
  outputFile,
  setDataPath
} = require("../../utils");
const { PATH } = require("../../constants");

exports.test = async ({ args, win }) => {
  win.webContents.send("xianyu.test", {
    result: "OK"
  });
};

exports.get_product = async ({ args, win }) => {
  const {
    data: { message }
  } = args;
  win.webContents.send("xianyu.get_product", {
    data: message
  });
};
