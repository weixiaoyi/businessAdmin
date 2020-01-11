const path = require("path");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const { PATH } = require("../constants");
const { ensureDir, pathExists, outputFile } = require("./fsExtra");
const { setDataPath } = require("./helper");

const getDb = async ({ dir, dbName, defaultValue }) => {
  if (!dbName) return console.log("dbName必填参数");
  await ensureDir(dir);
  const adapter = new FileAsync(path.join(dir, dbName), {
    defaultValue,
    serialize: array => JSON.stringify(array),
    deserialize: string => JSON.parse(string)
  });
  return low(adapter);
};

// exports.getScrapyDb = async dbName => {
//   if (!dbName) return console.log("dbName必填参数");
//   const dir = path.join(setDataPath(), PATH.scrapyDb);
//   await ensureDir(dir);
//   const adapter = new FileAsync(path.join(dir, dbName), {
//     defaultValue: { answers: [] },
//     serialize: array => JSON.stringify(array),
//     deserialize: string => JSON.parse(string)
//   });
//   return low(adapter);
// };

exports.getScrapyDb = async dbName => {
  return getDb({
    dir: path.join(setDataPath(), PATH.scrapyDb),
    dbName,
    defaultValue: { answers: [] }
  });
};

exports.getXianyuImageDb = async dbName => {
  return getDb({
    dir: path.join(setDataPath(), PATH.xianyuDb),
    dbName,
    defaultValue: { images: [] }
  });
};

exports.getXianyuVersionDb = async dbName => {
  return getDb({
    dir: path.join(setDataPath(), PATH.xianyuDb),
    dbName,
    defaultValue: { versions: {} }
  });
};

exports.getXianyuProductDb = async dbName => {
  return getDb({
    dir: path.join(setDataPath(), PATH.xianyuDb),
    dbName,
    defaultValue: { products: [] }
  });
};

exports.setPreloadFile = async () => {
  const dir = path.join(setDataPath(), PATH.globalConfigs);
  const filePath = path.join(dir, "preload.js");
  const exists = await pathExists(filePath);
  if (!exists) {
    const str = `
    const { ipcRenderer } = require("electron");
    const path = require("path");
    if (!window.ipc) {
      window.ipc = ipcRenderer;
      window.path = path;
     }`;
    await outputFile(filePath, str);
  }
  return filePath;
};
