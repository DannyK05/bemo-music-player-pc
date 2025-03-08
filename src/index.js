const displayScreen = document.querySelector(".title-screen");
const playBtn = document.querySelector(".play");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const audioPlayer = document.querySelector("#audio-player");

const retrievedMusicFiles = [];
async function selectMusicFolder() {
  const selectedFolder = await window.electronAPI.selectMusicFolder();
  if (!selectedFolder) {
    console.log("No folder seleted");
  } else {
    console.log(selectedFolder);
    const musicFiles = await window.electronAPI.getMusicFiles(selectedFolder);
    console.log("Music", musicFiles);
  }
}
selectMusicFolder();

const states = "Home";

const homeRender = `<div class="" onclick =${selectMusicFolder} ><span>+</span> Add new source</div> ${musi}`;
