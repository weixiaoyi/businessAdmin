const { decode } = require("node-base64-image");
const { app } = require("electron");

exports.parseDataUrl2Image = (dataUrl, filename) => {
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  const dataBuffer = Buffer.from(base64Data, "base64");
  return new Promise((resolve, reject) => {
    decode(
      dataBuffer,
      {
        filename
      },
      (err, msg) => {
        if (!err && msg) {
          return resolve(msg);
        }
        return reject(err);
      }
    );
  });
};

exports.setDataPath = () => {
  let bitXDataPath;
  switch (process.platform) {
    case "win32":
      bitXDataPath = `${app.getPath("appData")}`;
      break;
    case "darwin":
      bitXDataPath = `${app.getPath("home")}/Library/Application Support/FuYe`;
      break;
    case "linux":
      bitXDataPath = `${app.getPath("home")}/.fuye`;
  }
  return bitXDataPath;
};
