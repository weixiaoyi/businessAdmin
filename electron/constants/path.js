exports.PATH = {
  scrapyDb:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/database"
      : "/fuyeAssets/prod/database",
  scrapyImageDir:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/images"
      : "/fuyeAssets/prod/images"
};
