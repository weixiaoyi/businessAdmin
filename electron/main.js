require("@babel/register");
const { app } = require("electron");
const { createWindow } = require("./utils");
app.wins = {};

function createMainWindow() {
  app.wins.main = createWindow({
    url: "http://localhost:3000",
    width: 1000,
    height: 1000,
    openDevTools: true,
    onOpenCallback: window => {
      require("./tasks");
      require("./tasks/main").default(window, undefined, app);
    },
    onCloseCallback: () => (app.wins.main = null)
  });
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (app.wins.main === null) {
    createMainWindow();
  }
});
