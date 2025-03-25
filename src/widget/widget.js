const displayScreen = document.querySelector(".title-screen");
const playBtn = document.querySelector(".play");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const audioPlayer = document.querySelector("#audio-player");
const playerBtn = document.querySelector(".widget__button--enlarge");

let currentSong = sessionStorage.getItem("currentSong") || "";
const defaultPath = localStorage.getItem("defaultPath") || "";
let playing = JSON.parse(sessionStorage.getItem("playing"));
console.log(playing);
if (currentSong !== "" && defaultPath !== "") {
  audioPlayer.src = defaultPath + currentSong;
  audioPlayer.currentTime =
    parseInt(sessionStorage.getItem("currentTime")) + 0.2 || 0;
  audioPlayer.play();
}
playerBtn.addEventListener("click", () => {
  sessionStorage.setItem("playing", JSON.stringify(playing));
  sessionStorage.setItem("currentTime", audioPlayer.currentTime + 0.2);
});
