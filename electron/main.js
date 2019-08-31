require("@babel/register");
const { app } = require("electron");
const { createWindow } = require("./utils");

let win;
function createMainWindow() {
  win = createWindow({
    url: "http://localhost:3000",
    width: 1000,
    height: 1000,
    openDevTools: true,
    onOpenCallback: () => {
      require("./tasks");
    }
  });
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createMainWindow();
  }
});
