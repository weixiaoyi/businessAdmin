exports.PATH = {
  scrapyDb:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/scrapy/db"
      : "/fuyeAssets/prod/scrapy/db",
  scrapyImageDir:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/scrapy/image"
      : "/fuyeAssets/prod/scrapy/image",
  globalConfigs:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/globalConfigs"
      : "/fuyeAssets/prod/globalConfigs",

  onlineImageDir:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/online/image"
      : "/fuyeAssets/prod/online/image",
  onlineDb:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/online/db"
      : "/fuyeAssets/prod/online/db"
};
