import path from "path";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

export const getScrapyDb = () => {
  const adapter = new FileSync(
    path.join(__dirname, "../assets/scrapy-db.json"),
    {
      defaultValue: { answers: [] },
      serialize: array => JSON.stringify(array),
      deserialize: string => JSON.parse(string)
    }
  );
  return low(adapter);
};
