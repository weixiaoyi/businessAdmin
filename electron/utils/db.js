import path from "path";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";

export const getScrapyDb = () => {
  const adapter = new FileAsync(
    path.join(__dirname, "../assets/scrapy-db.json"),
    {
      defaultValue: { answers: [] },
      serialize: array => JSON.stringify(array),
      deserialize: string => JSON.parse(string)
    }
  );
  return low(adapter);
};
