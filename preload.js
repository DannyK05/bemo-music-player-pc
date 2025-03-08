const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectMusicFolder: () => ipcRenderer.invoke("dialog:openFolder"),
  getMusicFiles: (folder) => ipcRenderer.invoke("getMusicFiles", folder),
});
