console.log("Welcome to Spotify")


let currentSong = new Audio();



async function getSongs(){

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
        }
    }
    return songs
}


//play music
const playMusic = (track)=>{
    //let audio = new Audio("/songs/" + track);
    currentSong.src = "/songs/" + encodeURIComponent(track)
    currentSong.play()
}


async function main(){

    
    // get lists of all songs
    let songs = await getSongs()



    //showing songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs ) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("-","")}</div>
                                
                            </div>
                            <div class="playnow">
                                <span>Play </span>
                                <img class="invert" src="libplay.svg" alt="">
                            </div> </li>`;
        
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

}
main()

