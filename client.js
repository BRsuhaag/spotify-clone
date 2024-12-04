console.log("Welcome to Spotify");
let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1])); // Decode to handle special characters
        }
    }
    // Show songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("-", " ")}</div>
            </div>
            <div class="playnow">
                <span>Play </span>
                <img class="invert" src="libplay.svg" alt="">
            </div>
        </li>`;
    }

    // Attach click event to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}

// Play music
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + encodeURIComponent(track); // Encode to handle spaces and special characters
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
};

async function displayAlbum() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <!-- Circle Background -->
                                <circle cx="20" cy="20" r="20" fill="#1DB954" />
                                <!-- Enlarged Play Icon -->
                                <svg x="10" y="10" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path d="M8.5 8L17.5 12L8.5 16V8Z" fill="black" />
                                </svg>
                            </svg>
                            
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    //loading folder to card
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })

}

async function main() {
    // Get the list of all songs
    await getSongs("songs/copied");
    playMusic(songs[0], true)

    //Display all time
    await displayAlbum()


    //Attach an event listener
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // listenr for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //seeking in bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    //add open burger
    document.querySelector(".hamburger").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "0"
    })
    //add close burger
    document.querySelector(".close").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "-120%"
    })

    // next and previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked");
        let currentSrc = currentSong.src.split("/").pop(); // Extract only the filename
        let index = songs.indexOf(decodeURIComponent(currentSrc)); // Ensure proper decoding
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("Next clicked");
        let currentSrc = currentSong.src.split("/").pop(); // Extract only the filename
        let index = songs.indexOf(decodeURIComponent(currentSrc)); // Ensure proper decoding
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    //volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    
    })


    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
    

}




main();
