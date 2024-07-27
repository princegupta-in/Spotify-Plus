const url = "http://127.0.0.1:3000/songs/";

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

async function getSongs() {
    const data = await fetch(url);
    const texts = await data.text();
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = texts;
    let as = tempDiv.getElementsByTagName("a");
    const songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.replaceAll("%20", " "));
        }
    }
    return songs;
}

// this will ensure that only one song play at a time
// Declare the audio variable globally
let audio = null;
let currentSongIndex = 0; // Global variable to keep track of the current song index
let songs = []; // Global variable to store the list of songs

function playIt(songUrl, songTitle, index) {
    // Stop any currently playing audio
    if (audio) {
        audio.pause();
    }
    // then play the new audio
    audio = new Audio(songUrl);
    audio.play();
    play_me.src = "pause.svg";

    //in playBar display song name and time
    document.querySelector(".songInfo").innerHTML = songTitle;

    //currentTime and duration are methods
    audio.addEventListener("timeupdate", () => {
        let currentTime = audio.currentTime;
        let duration = audio.duration;
        document.querySelector(".songTime").innerHTML = `${formatTime(currentTime)}/${formatTime(duration)}`;
        document.querySelector(".circle").style.left = `${(currentTime / duration) * 100}%`;
    });

    document.querySelector(".seekBar").addEventListener("click", (e) => {
        document.querySelector(".circle").style.left = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) + "%";
        audio.currentTime = ((e.offsetX / e.target.getBoundingClientRect().width) * audio.duration);
    });

    // Change play button back to play icon when audio ends
    audio.addEventListener("ended", () => {
        document.querySelector("#play_me").src = "play.svg";
    });

    currentSongIndex = index; // Update the current song index
}

async function main() {
    songs = await getSongs(); // Assign songs to the global variable
    const songList = document.querySelector(".songList");

    songs.forEach((element, index) => {
        const songTitle = element.split("/songs/")[1];
        const listItem = document.createElement("li");
        songList.appendChild(listItem);
        listItem.innerHTML = `<div class="miniBar">
                                <div class="music-logo"><img class="invert" src="music.svg" alt=""></div>
                                <div class="info">
                                    <div class="song-Name">${songTitle}</div>
                                    <div class="artist-Name">artist name</div>
                                </div>
                                <div class="play-option">
                                    <span>play now</span>
                                    <img class="invert" src="play.svg" alt="">
                                </div>`;


        //adding event listener to the play now button
        //will call the playIt function created in global
        //as element is accessible here in this block only thats why i am doing this stuff here, note that here element is already object of array, hopefully i have used the correct word here "object".                        
        listItem.querySelector(".play-option").addEventListener("click", () => {
            playIt(element, songTitle, index);
        });
    });
    //if play then pause and viseversa
    document.querySelector(".songButton").querySelector("#play_me").addEventListener("click", () => {
        if (audio) {
            if (audio.paused) {
                audio.play();
                play_me.src = "pause.svg";
            } else {
                audio.pause();
                play_me.src = "play.svg";
            }
        }
    });

    document.querySelector("#hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + `%`;
    });

    document.querySelector(".cutIcon").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + `%`;
    });

    document.querySelector("#next-me").addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
        } else {
            currentSongIndex = 0; // Loop back to the first song if at the end of the list
        }
        const nextSongUrl = songs[currentSongIndex];
        const nextSongTitle = nextSongUrl.split("/songs/")[1];
        playIt(nextSongUrl, nextSongTitle, currentSongIndex);
    });

    document.querySelector("#previous-me").addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
        } else {
            currentSongIndex = (songs.length - 1);
        }
        const previousSongUrl = songs[currentSongIndex];
        const previousSongTitle = previousSongUrl.split("/songs/")[1];
        playIt(previousSongUrl, previousSongTitle, currentSongIndex);
    })
}


main();

