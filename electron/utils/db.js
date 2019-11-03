const path = require("path");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const { PATH } = require("../constants");
const { ensureDir } = require("./fsExtra");
const { setDataPath } = require("./helper");

exports.getScrapyDb = async dbName => {
  if (!dbName) return console.log("dbName必填参数");
  const dir = path.join(setDataPath(), PATH.scrapyDb);
  await ensureDir(dir);
  const adapter = new FileAsync(path.join(dir, dbName), {
    defaultValue: { answers: [] },
    serialize: array => JSON.stringify(array),
    deserialize: string => JSON.parse(string)
  });
  return low(adapter);
};
