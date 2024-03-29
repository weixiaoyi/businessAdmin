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

exports.get_appPath = async ({ args, win }) => {
  win.webContents.send("scrapy.get-appPath", {
    imagesPath: path.join(setDataPath(), PATH.scrapyImageDir)
  });
};

exports.openPath = async ({ args }) => {
  const {} = args;
  const dir = path.join(setDataPath(), PATH.scrapyDb);
  shell.openItem(dir);
};

// 分页获取answer
exports.get_answers = async ({ args, win }) => {
  const { dbName, data } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const { pageNum, pageSize } = data;
  const answers = scrapyDb.get("answers").value();
  const list = answers.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  win.webContents.send("scrapy.get-answers", {
    data: list,
    total: answers.length,
    pageSize,
    current: pageNum
  });
};

// 获取所有answer
exports.get_all_answers = async ({ args, win, app }) => {
  const { dbName } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const answers = scrapyDb.get("answers").value();
  win.webContents.send("scrapy.get-all-answers", {
    data: answers
  });
  app.wins.scrapyPreviewPdf &&
    app.wins.scrapyPreviewPdf.webContents.send("scrapy.get-all-answers", {
      data: answers
    });
};

// 删除answer
exports.delete_answers = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const result = await scrapyDb
    .get("answers")
    .remove({ answerId })
    .write()
    .catch(() => null);
  win.webContents.send("scrapy.delete-answers", result ? answerId : null);
};

// 更新本地answer
exports.update_answers = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId, content, ...rest }
  } = args;

  const scrapyDb = await getScrapyDb(dbName);
  const findOne = await scrapyDb
    .get("answers")
    .find({ answerId })
    .assign({
      ...(content
        ? {
            content: content.replace(
              /src="[^>]*\\(.*?)\.(jpg|png).*?"/g,
              `src="http://$1.jpg"`
            )
          }
        : {}),
      ...rest,
      type: undefined
    })
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.update-answers",
    findOne ? findOne.answerId : null
  );
};

// 批量删除answers
exports.mass_delete_answers = async ({ args, win }) => {
  const {
    dbName,
    data: { answerIds }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const result = await scrapyDb
    .get("answers")
    .remove(item => answerIds.find(one => one === item.answerId))
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.mass-delete-answers",
    result && result.length ? answerIds : null
  );
};

// 下载图片
exports.download_image = async ({ args, win }) => {
  const {
    dbName,
    data: { dataUrl, filename }
  } = args;
  const dir = path.join(setDataPath(), PATH.scrapyImageDir, dbName);
  await ensureDir(dir);
  const result = await parseDataUrl2Image(
    dataUrl,
    path.join(dir, filename)
  ).catch(() => null);
  win.webContents.send("scrapy.download-image", result);
};

// 下载pdf
exports.download_pdf = async ({ args, win, app }) => {
  if (!app.wins.scrapyPreviewPdf) {
    return win.webContents.send("scrapy.download-pdf", {
      success: false,
      message: "请先打开预览pdf窗口"
    });
  }
  app.wins.scrapyPreviewPdf &&
    app.wins.scrapyPreviewPdf.webContents.printToPDF(
      {
        printBackground: true
      },
      async (err, data) => {
        if (err) {
          return win.webContents.send("scrapy.download-pdf", {
            success: false,
            message: err
          });
        } else {
          await outputFile("./print.pdf", data);
          win.webContents.send("scrapy.download-pdf", {
            success: true
          });
        }
      }
    );
};

// 上传answer成功
exports.upload_answer_success = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const findOne = await scrapyDb
    .get("answers")
    .find({ answerId })
    .assign({ online: "upload" })
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.upload-answer-success",
    findOne ? findOne.answerId : null
  );
};

// 上线answer成功
exports.online_answer_success = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const findOne = await scrapyDb
    .get("answers")
    .find({ answerId })
    .assign({ online: "on" })
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.online-answer-success",
    findOne ? findOne.answerId : null
  );
};

// 下线answer成功
exports.offline_answer_success = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const findOne = await scrapyDb
    .get("answers")
    .find({ answerId })
    .assign({ online: "off" })
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.offline-answer-success",
    findOne ? findOne.answerId : null
  );
};

// 删除线上answer成功
exports.delete_line_answer_success = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const findOne = await scrapyDb
    .get("answers")
    .find({ answerId })
    .assign({ online: null })
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.delete-line-answer-success",
    findOne ? findOne.answerId : null
  );
};

// 更新线上answer成功
exports.update_line_answer_success = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const findOne = await scrapyDb
    .get("answers")
    .find({ answerId })
    .assign({ update: false })
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.update-line-answer-success",
    findOne ? findOne.answerId : null
  );
};

// 检测线上answer
exports.check_line_answer_success = async ({ args, win }) => {
  const {
    dbName,
    data: { answerId, online }
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  const findOne = await scrapyDb
    .get("answers")
    .find({ answerId })
    .assign({ online })
    .write()
    .catch(() => null);
  win.webContents.send(
    "scrapy.check-line-answer-success",
    findOne ? findOne.answerId : null
  );
};
