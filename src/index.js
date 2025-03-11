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
let songIndex = null;
let prevSongIndex = null;
let currentSong = "Hi";
const playIcon = ` <img src="./assets/svgs/play.svg" width="20" height="20" alt="Play"/>`;
const pauseIcon = ` <img src="./assets/svgs/pause.svg" width="20" height="20" alt="Pause"/>`;

const homeRender = `<img class="home-video" src="./assets/gifs/bmo-dancing.gif"/>`;

function renderHome() {
  content.innerHTML = homeRender;
}
function renderMusic() {
  const musicFilesRender = retrievedMusicFiles
    .map(
      (files) =>
        `<div class="song-${retrievedMusicFiles.indexOf(
          files
        )}" onclick="playMusic('${files}')">` +
        files +
        "</div>"
    )
    .join(" ");
  console.log("Music Files Render", musicFilesRender);
  const filesRender = `<div class="files-render"><div class="add-source" onclick="selectMusicFolder()" ><span>+</span> Add new source</div> ${musicFilesRender}</div> `;
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

function highlightCurentSong() {
  const currentSongDiv = document.querySelector(`.song-${songIndex}`);
  if (prevSongIndex !== null) {
    const prevSongDiv = document.querySelector(`.song-${prevSongIndex}`);
    prevSongDiv.classList.remove("current-song");
  }
  currentSongDiv.classList.add("current-song");
}

function playMusic(filePath) {
  console.log(`${defaultPath + filePath}`);
  if (songIndex !== null) {
    prevSongIndex = songIndex;
  }
  songIndex = retrievedMusicFiles.indexOf(filePath);
  if (songIndex == null) {
    prevSongIndex = songIndex;
  }
  audioPlayer.src = `${defaultPath + filePath}`;
  audioPlayer.play();
  displayScreen.textContent = `${retrievedMusicFiles[songIndex]}`;
  playBtn.innerHTML = pauseIcon;
  playing = true;
  audioPlayer.onended = () => {
    handleNextSong();
  };
  highlightCurentSong();
}

content.innerHTML = homeRender;
playBtn.innerHTML = playIcon;
displayScreen.textContent = currentSong;

function playPause() {
  if (retrievedMusicFiles.length > 0) {
    if (playing) {
      audioPlayer.pause();
      playing = false;
      playBtn.innerHTML = playIcon;
    } else {
      audioPlayer.play();
      playing = true;
      playBtn.innerHTML = pauseIcon;
    }
    audioPlayer.onended = () => {
      handleNextSong();
    };
  }
}

function handlePrevSong() {
  if (retrievedMusicFiles.length === 0) return;

  if (songIndex > 0) {
    if (songIndex !== null) {
      prevSongIndex = songIndex;
    }
    songIndex--;
    audioPlayer.src = `${defaultPath + retrievedMusicFiles[songIndex]}`;
    audioPlayer.play();
    playBtn.innerHTML = pauseIcon;
    playing = true;
  } else {
    if (songIndex !== null) {
      prevSongIndex = songIndex;
    }
    songIndex = retrievedMusicFiles.length - 1;
    audioPlayer.src = `${defaultPath + retrievedMusicFiles[songIndex]}`;
    audioPlayer.play();
    playBtn.innerHTML = pauseIcon;
    playing = true;
  }
  currentSong = retrievedMusicFiles[songIndex];
  displayScreen.textContent = currentSong;
  highlightCurentSong();
}

function handleNextSong() {
  if (retrievedMusicFiles.length === 0) return;

  if (songIndex < retrievedMusicFiles.length - 1) {
    if (songIndex !== null) {
      prevSongIndex = songIndex;
    }
    songIndex++;
    audioPlayer.src = `${defaultPath + retrievedMusicFiles[songIndex]}`;
    audioPlayer.play();
    playBtn.innerHTML = pauseIcon;
    playing = true;
  } else {
    if (songIndex !== null) {
      prevSongIndex = songIndex;
    }
    songIndex = 0;
    audioPlayer.src = `${defaultPath + retrievedMusicFiles[songIndex]}`;
    audioPlayer.play();
    playBtn.innerHTML = pauseIcon;
    playing = true;
  }
  currentSong = retrievedMusicFiles[songIndex];
  displayScreen.textContent = currentSong;
  highlightCurentSong();
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

prevBtn.addEventListener("click", () => {
  handlePrevSong();
});
nextBtn.addEventListener("click", () => {
  handleNextSong();
});
