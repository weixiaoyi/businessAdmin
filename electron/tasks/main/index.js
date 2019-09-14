import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import { decode } from "node-base64-image";
import { getScrapyDb, parseDataUrl2Image, ensureDir } from "../../utils";
import { PATH } from "../../constants";
import fs from "fs";

let win;

export default window => {
  win = window;
};

export const messageTasks = async (args, app) => {
  const {
    dbName,
    data: { type },
    data
  } = args;
  const scrapyDb = await getScrapyDb(dbName);
  if (type === "scrapy.get-answers") {
    const { pageNum, pageSize } = data;
    const answers = scrapyDb.get("answers").value();
    const list = answers.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    win.webContents.send("scrapy.get-answers", {
      data: list,
      total: answers.length,
      pageSize,
      current: pageNum
    });
  } else if (type === "scrapy.get-all-answers") {
    const answers = scrapyDb.get("answers").value();
    win.webContents.send("scrapy.get-all-answers", {
      data: answers
    });
  } else if (type === "scrapy.delete-answers") {
    const {
      data: { answerId }
    } = args;
    const result = await scrapyDb
      .get("answers")
      .remove({ answerId })
      .write()
      .catch(() => null);
    win.webContents.send("scrapy.delete-answers", result ? answerId : null);
  } else if (type === "scrapy.update-answers") {
    const {
      data: { answerId, ...rest }
    } = args;
    const findOne = await scrapyDb
      .get("answers")
      .find({ answerId })
      .assign({ ...rest })
      .write()
      .catch(() => null);
    win.webContents.send(
      "scrapy.update-answers",
      findOne ? findOne.answerId : null
    );
  } else if (type === "scrapy.mass-delete-answers") {
    const {
      data: { answerIds }
    } = args;
    const result = await scrapyDb
      .get("answers")
      .remove(item => answerIds.find(one => one === item.answerId))
      .write()
      .catch(() => null);
    win.webContents.send(
      "scrapy.mass-delete-answers",
      result && result.length ? answerIds : null
    );
  } else if (type === "scrapy.download-image") {
    const {
      data: { dataUrl, filename }
    } = args;
    const dir = path.join(__dirname, PATH.scrapyImageDir, dbName);
    await ensureDir(dir);
    const result = await parseDataUrl2Image(
      dataUrl,
      path.join(dir, filename)
    ).catch(() => null);
    win.webContents.send("scrapy.download-image", result);
  } else if (type === "scrapy.download-pdf") {
    app.wins.scrapyPreviewPdf.webContents.printToPDF(
      {
        printBackground: true
      },
      (err, data) => {
        if (err) throw err;
        fs.writeFile("./print.pdf", data, error => {
          if (error) throw error;
          console.log("Write PDF successfully.");
        });
      }
    );
  }
};
