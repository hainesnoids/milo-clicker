const songs = [
    {
        "name": "Moon Fries",
        "artist": [ "KingSammelot" ],
        "src": "item-data/album/Moon Fries.opus",
        "cover": "item-data/album/Moon Fries.jpg"
    },
    {
        "name": "Jazzy Juice",
        "artist": [ "KingSammelot" ],
        "src": "item-data/album/Jazzy Juice.opus",
        "cover": "item-data/album/Jazzy Juice.jpg"
    },
    {
        "name": "Muga Million",
        "artist": [ "KingSammelot" ],
        "src": "item-data/album/Muga Million.opus",
        "cover": "item-data/album/Muga Million.jpg"
    },
    {
        "name": "I AM WEALTHY",
        "artist": [ "KingSammelot" ],
        "src": "item-data/album/I AM WEALTHY.opus",
        "cover": "item-data/album/I AM WEALTHY.jpg"
    },
    {
        "name": "SHPLOINK OVERDOSE",
        "artist": [ "KingSammelot" ],
        "src": "item-data/album/SHPLOINK OVERDOSE.opus",
        "cover": "item-data/album/SHPLOINK OVERDOSE.jpg"
    }
]


const songTitle = document.querySelector(".music .track-title")
const songArtist = document.querySelector(".music .track-artist");
const songCover = document.querySelector(".music .track-cover");
const musicPlayer = document.querySelector(".music .player");
const playbackPrev = document.querySelector(".music .playback-prev");
const playbackPause = document.querySelector(".music .playback-pause");
const playbackNext = document.querySelector(".music .playback-next");
const clock = document.querySelector(".music .track-time");
const clockNeg = document.querySelector(".music .track-time-neg");
const trackProgressInner = document.querySelector(".music .track-progress-inner");
const playerVolume = document.querySelector(".music .player-volume input");

let idx = 0;

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${String(sec).padStart(2,"0")}`;
}

function loadSong(idx) {
    const song = songs[idx];

    songTitle.innerText = song.name;
    songArtist.innerText = song.artist.join(" & ");
    songCover.src = song.cover;
    musicPlayer.src = song.src;

    navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist.join(" & "),
        artwork: [
            { src: song.cover, sizes: "700x700", type: "image/jpg" }
        ]
    })

    clock.innerText = "-:--";
    clockNeg.innerText = "--:--";
}

function updateProgress() {
    const currentTime = musicPlayer.currentTime;
    const duration = musicPlayer.duration || 0;

    clock.innerText = formatTime(currentTime);
    clockNeg.innerText = `-${formatTime(duration - currentTime)}`;

    trackProgressInner.style.width = `${(currentTime / duration) * 100}%`;
}

musicPlayer.addEventListener("timeupdate", updateProgress);

musicPlayer.addEventListener("ended", () => {
    idx = (idx + 1) % songs.length;
    loadSong(idx);
    play();
});

musicPlayer.addEventListener("pause", () => {
    pause();
});

musicPlayer.addEventListener("play", () => {
    play();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "MediaTrackNext" || e.key === "MediaFastForward") {
        idx = (idx + 1) % songs.length;
        loadSong(idx);
    } else if (e.key === "MediaTrackPrevious" || e.key === "MediaRewind") {
        idx = (idx - 1 + songs.length) % songs.length;
        loadSong(idx);
    }
})

musicPlayer.addEventListener("loadedmetadata", () => {
    //progress.max = musicPlayer.duration;
});

playerVolume.addEventListener("input", () => {
    musicPlayer.volume = playerVolume.value/100;
})

/*progress.addEventListener("input", () => {
    const seekTime = (progress.value / 100) * musicPlayer.duration;
    musicPlayer.currentTime = seekTime;
});*/

function play() {
    try {
        musicPlayer.play();
    } catch(err) {
        console.log("Browser denied autoplay");
    } finally {
        playbackPause.innerHTML = '<img src="item-data/album/icons/media-playback-pause.svg" alt="Pause"/>';
    }
}

function pause() {
    musicPlayer.pause();
    playbackPause.innerHTML = '<img src="item-data/album/icons/media-playback-start.svg" alt="Play"/>';
}

playbackPause.addEventListener("click", () => {
    if (musicPlayer.paused) {
        play();
    } else {
        pause();
    }
});

playbackNext.addEventListener("click", () => {
    idx = (idx + 1) % songs.length;
    loadSong(idx);
    play();
});

playbackPrev.addEventListener("click", () => {
    idx = (idx - 1 + songs.length) % songs.length;
    loadSong(idx);
    play();
});

musicPlayer.volume = playerVolume.value/100;
loadSong(idx);