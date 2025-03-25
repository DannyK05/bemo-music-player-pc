const displayScreen = document.querySelector(".title-screen");
const playBtn = document.querySelector(".play");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const audioPlayer = document.querySelector("#audio-player");
const content = document.querySelector(".main-container");
const homeNav = document.querySelector(".home");
const musicNav = document.querySelector(".music");
const widgetBtn = document.querySelector(".widget-mode");

let retrievedMusicFiles =
  JSON.parse(localStorage.getItem("retrievedMusicFiles")) || [];
let defaultPath = localStorage.getItem("defaultPath") || "";
let playing = JSON.parse(sessionStorage.getItem("playing")) || false;
let prevSongIndex = null;
let currentSong = sessionStorage.getItem("currentSong") || "Hi";
let songIndex =
  currentSong !== "Hi" ? retrievedMusicFiles.indexOf(currentSong) : null;
console.log(songIndex);
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

function storeCurrentSong(song) {
  sessionStorage.setItem("currentSong", song);
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
    localStorage.setItem("defaultPath", defaultPath);
    localStorage.setItem(
      "retrievedMusicFiles",
      JSON.stringify(retrievedMusicFiles)
    );
    renderMusic();
  }
}

function highlightCurentSong() {
  const currentSongDiv = document.querySelector(`.song-${songIndex}`);
  console.log("Prev", prevSongIndex);
  console.log("Current", songIndex);
  if (prevSongIndex && prevSongIndex !== null) {
    const prevSongDiv = document.querySelector(`.song-${prevSongIndex}`);
    prevSongDiv.classList.remove("current-song");
  }
  currentSongDiv.classList.add("current-song");
  storeCurrentSong(retrievedMusicFiles[songIndex]);
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
  storeCurrentSong(filePath);
  audioPlayer.src = `${defaultPath + filePath}`;
  audioPlayer.play();
  displayScreen.textContent = `${retrievedMusicFiles[songIndex]}`;
  playBtn.innerHTML = pauseIcon;
  playing = true;
  sessionStorage.setItem("playing", playing);
  audioPlayer.onended = () => {
    handleNextSong();
  };
  highlightCurentSong();
}

console.log(defaultPath);
if (defaultPath !== "") {
  renderMusic();
}

content && (content.innerHTML = homeRender);
playBtn.innerHTML = playIcon;
displayScreen.textContent = currentSong;

function playPause() {
  if (retrievedMusicFiles.length > 0) {
    console.log("click");
    if (playing) {
      audioPlayer.pause();
      playing = false;
      sessionStorage.setItem("playing", playing);
      playBtn.innerHTML = playIcon;
    } else {
      audioPlayer.play();
      playing = true;
      sessionStorage.setItem("playing", playing);
      playBtn.innerHTML = pauseIcon;
    }
    sessionStorage.setItem("playing", JSON.stringify(playing));
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
    sessionStorage.setItem("playing", playing);
  } else {
    if (songIndex !== null) {
      prevSongIndex = songIndex;
    }
    songIndex = retrievedMusicFiles.length - 1;
    audioPlayer.src = `${defaultPath + retrievedMusicFiles[songIndex]}`;
    audioPlayer.play();
    playBtn.innerHTML = pauseIcon;
    playing = true;
    sessionStorage.setItem("playing", playing);
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
    sessionStorage.setItem("playing", playing);
  } else {
    if (songIndex !== null) {
      prevSongIndex = songIndex;
    }
    songIndex = 0;
    audioPlayer.src = `${defaultPath + retrievedMusicFiles[songIndex]}`;
    audioPlayer.play();
    playBtn.innerHTML = pauseIcon;
    playing = true;
    sessionStorage.setItem("playing", playing);
  }
  currentSong = retrievedMusicFiles[songIndex];
  displayScreen.textContent = currentSong;
  highlightCurentSong();
}

if (playing) {
  renderMusic();
  audioPlayer.src = defaultPath + currentSong;
  audioPlayer.currentTime = sessionStorage.getItem("currentTime");
  audioPlayer.play();
  playBtn.innerHTML = pauseIcon;
  highlightCurentSong();
}

homeNav &&
  homeNav.addEventListener("click", () => {
    renderHome();
  });

musicNav &&
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
widgetBtn.addEventListener("click", () => {
  sessionStorage.setItem("currentTime", audioPlayer.currentTime + 0.2);
});
