import { decode } from "node-base64-image";

export const parseDataUrl2Image = (dataUrl, filename) => {
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
