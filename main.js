const { app, BrowserWindow, ipcMain, dialog } = require(`electron`);
const path = require(`path`);
const fs = require("fs").promises;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, `preload.js`),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(`./src/index.html`);
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("dialog:openFolder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return result || null;
});
ipcMain.handle("getMusicFiles", async (event, selectedFolder) => {
  const files = await fs.readdir(selectedFolder.filePaths[0]);
  const musicFiles = files.filter((file) =>
    file.toLowerCase().endsWith(".mp3")
  );

  return musicFiles;
});
