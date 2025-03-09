const displayScreen = document.querySelector(".title-screen");
const playBtn = document.querySelector(".play");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const audioPlayer = document.querySelector("#audio-player");
const content = document.querySelector(".main-container");
const homeNav = document.querySelector(".home");
const musicNav = document.querySelector(".music");
let retrievedMusicFiles = [];
let defaultPath = "";
let playing = false;
const playIcon = ` <img src="./assets/svgs/play.svg" width="20" height="20" alt="Play"/>`;
const pauseIcon = ` <img src="./assets/svgs/pause.svg" width="20" height="20" alt="Pause"/>`;

const homeRender = `<img class="home-video" src="./assets/gifs/bmo-dancing.gif"/>`;

function renderHome() {
  content.innerHTML = homeRender;
}
function renderMusic() {
  const musicFilesRender = retrievedMusicFiles
    .map((files) => `<div onclick="playMusic('${files}')">` + files + "</div>")
    .join(" ");
  console.log("Music Files Render", musicFilesRender);
  const filesRender = `<div class="" onclick="selectMusicFolder()" ><span>+</span> Add new source</div> <div>${musicFilesRender}</div> `;
  content.innerHTML = filesRender;
}

async function selectMusicFolder() {
  const selectedFolder = await window.electronAPI.selectMusicFolder();
  if (!selectedFolder) {
    console.log("No folder seleted");
  } else {
    console.log(selectedFolder);
    const musicFiles = await window.electronAPI.getMusicFiles(selectedFolder);
    retrievedMusicFiles = musicFiles;
    defaultPath = selectedFolder.filePaths[0] + "/";
    renderMusic();
  }
}

function playMusic(filePath) {
  console.log(`${defaultPath + filePath}`);
  audioPlayer.src = `${defaultPath + filePath}`;
  audioPlayer.play();
  displayScreen.textContent = `${filePath}`;
  playBtn.innerHTML = pauseIcon;
  playing = true;
}

content.innerHTML = homeRender;
playBtn.innerHTML = playIcon;

function playPause() {
  if (playing) {
    audioPlayer.pause();
    playing = false;
    playBtn.innerHTML = playIcon;
  } else {
    audioPlayer.play();
    playing = true;
    playBtn.innerHTML = pauseIcon;
  }
}

homeNav.addEventListener("click", () => {
  renderHome();
});

musicNav.addEventListener("click", () => {
  renderMusic();
});

playBtn.addEventListener("click", () => {
  playPause();
});
