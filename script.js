const url = "http://127.0.0.1:3000/songs/";

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

async function getSongs() {
    const data = await fetch(url);
    const texts = await data.text();
    // console.log(texts);
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = texts;//document.createElement("div").innerHTML = texts;
    // console.log(div)
    let as = tempDiv.getElementsByTagName("a");
    // console.log(as);
    const songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.replaceAll("%20", " "))
        }
    }
    return songs;
}


// this will ensure that only one song play at a time
let audio = null; // Declare the audio variable globally
function playIt(songUrl, songTitle) {
    // Stop any currently playing audio
    if (audio) {
        audio.pause();
        // play_me.src="play.svg";
    }
    // Play the new audio
    audio = new Audio(songUrl);
    audio.play();
    play_me.src = "pause.svg";

    //in playBar display song name and time
    document.querySelector(".songInfo").innerHTML = songTitle;

    //getting the audio time and duration
    audio.addEventListener("timeupdate", () => {
        // console.log(audio.currentTime, audio.duration);
        let currentTime = audio.currentTime;
        let duration = audio.duration;
        document.querySelector(".songTime").innerHTML=`${formatTime(currentTime)}/${formatTime(duration)}`

    })
}



// console.log(getSongs());
async function main() {
    const songs = await getSongs();
    console.log(songs);


    const songList = document.querySelector(".songList");
    // songList.innerHTML = "";

    songs.forEach(element => {
        console.log(element.split("/songs/")[1]);
        const songTitle = element.split("/songs/")[1];
        const listItem = document.createElement("li");
        // listItem.textContent = songTitle;
        songList.appendChild(listItem);
        listItem.innerHTML = `<div class="miniBar ">
                            <div class="music-logo"><img class="invert" src="music.svg" alt=""></div>
                            <div class="info">
                                <div class="song-Name">${songTitle}</div>
                                <div class="artist-Name">artist name</div>
                            </div>
                            <div class="play-option">
                                <span>play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>`


        //adding event listener to the play now button
        //will call the playIt function created in global
        //as element is accessible here in this block only thats why i am doing this stuff here, note that here element is already object of arrar, hopefully i have used the correct word here "object".   
        listItem.querySelector(".play-option").addEventListener("click", () => {
            playIt(element, songTitle);
        })


    })
    //if play then pause and viseversa
    document.querySelector(".songButton").querySelector("#play_me").addEventListener("click", () => {
        if (audio) {
            if (audio.paused) {
                audio.play()
                play_me.src = "pause.svg"
            }
            else {
                audio.pause()
                play_me.src = "play.svg"
            }
        }
    })



    // audio.addEventListener("timeupdate", () => {
    //     const currentTime = formatTime(audio.currentTime);
    //     console.log(currentTime);

    // })
}



main()


