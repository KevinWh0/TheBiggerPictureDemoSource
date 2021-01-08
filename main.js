const url = require("url");
const path = require("path");
const Electron = require("electron");

const frame = {
  width: 1555, // in pixels
  height: 900, // in pixels
};

let browser = undefined;
const file = url.format({
  protocol: "file:",
  slashes: true,
  pathname: path.join(Electron.app.getAppPath(), "index.html"),
});

Electron.app.on("ready", function () {
  browser = new Electron.BrowserWindow({
    width: frame.width,
    height: frame.height,
    webPreferences: { webSecurity: false },
  });
  browser.removeMenu();
  browser.on("closed", () => (browser = undefined));
  browser.loadURL(file);
  // browser.removeMenu()
});

Electron.app.on("window-all-closed", function () {
  Electron.app.quit();
});
