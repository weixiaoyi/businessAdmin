import path from "path";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import { PATH } from "../constants";
import { ensureDir } from "./fsExtra";

export const getScrapyDb = async dbName => {
  if (!dbName) return console.log("dbName必填参数");
  const dir = path.join(__dirname, PATH.scrapyDb);
  await ensureDir(dir);
  const adapter = new FileAsync(path.join(dir, dbName), {
    defaultValue: { answers: [] },
    serialize: array => JSON.stringify(array),
    deserialize: string => JSON.parse(string)
  });
  return low(adapter);
};
