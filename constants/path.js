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

  xianyuImageDir:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/xianyu/image"
      : "/fuyeAssets/prod/xianyu/image",
  xianyuDb:
    process.env.NODE_ENV === "development"
      ? "/fuyeAssets/dev/xianyu/db"
      : "/fuyeAssets/prod/xianyu/db"
};
