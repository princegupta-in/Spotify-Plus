const url = "http://127.0.0.1:3000/songs/";

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
    })
}
main()

//play the audio
var audio = new Audio(songs[0]);
audio.play();

