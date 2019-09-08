import path from "path";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import { PATH } from "../constants";
import { ensureDir } from "./fsExtra";

export const getScrapyDb = async () => {
  const dir = path.join(__dirname, PATH.scrapyDb);
  await ensureDir(dir);
  const adapter = new FileAsync(path.join(dir, "scrapy-db.json"), {
    defaultValue: { answers: [] },
    serialize: array => JSON.stringify(array),
    deserialize: string => JSON.parse(string)
  });
  return low(adapter);
};
