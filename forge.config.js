module.exports = {
  packagerConfig: {
    name: "BMO",
    asar: true,
    appCategoryType: "public.app-category.developer-tools",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "bemo-music-player",
        authors: "Oluwakolade Olubanjo",
        exe: "BMO.exe",
        setupExe: "BMO-setup.exe",
        setupIcon: "./src/assets/icon.ico",
        versionString: {
          CompanyName: "Oluwakolade Olubanjo",
          LegalCopyright: "Copyright © 2025 Oluwakolade Olubanjo",
          FileDescription: "A cool nostalgic adventure time music player",
          ProductName: "BMO",
        },
      },
    },
  ],
};
