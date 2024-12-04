console.log("Welcome to Spotify");

let currentSong = new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
        }
    }
    return songs;
}

//play music
const playMusic = (track) => {
    currentSong.src = "/songs/" + encodeURIComponent(track);
    currentSong.play();
};

async function main() {
    let songs = await getSongs();

    //showing songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let songItem = document.createElement("li");
        songItem.innerHTML = `
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("-", " ")}</div>
            </div>
            <div class="playnow">
                <span>Play </span>
                <img class="invert" src="libplay.svg" alt="">
            </div>
        `;
        songItem.querySelector(".playnow").addEventListener("click", () => playMusic(song));
        songUL.appendChild(songItem);
    }
}

main();