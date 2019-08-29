//require("@babel/register");
const path = require("path");
const { app, BrowserWindow } = require("electron");
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1800,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "render.js")
    }
  });
  win.loadURL("http://localhost:3000");
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
