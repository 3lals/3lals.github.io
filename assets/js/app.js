const app = document.querySelector(".app");
const navTitle = document.querySelector(".nav-title");
const library = document.querySelector(".library");
const libraryLink = document.getElementById("library-link");
const libraryList = document.querySelector(".library-list");
const progressBar = document.getElementById("progress");

libraryLink.addEventListener("click", openLibrary);

function openLibrary() {
  if (library.classList.contains("library-opened")) {
    app.classList.remove("zoom-out");
    library.classList.remove("library-opened");
    libraryLink.classList.remove("library-opened-link");
  } else {
    app.classList.add("zoom-out");
    library.classList.add("library-opened");
    libraryLink.classList.add("library-opened-link");
  }
  resizeNav();
}

function resizeNav() {
  if(window.innerWidth > 768) {
    navTitle.style.visibility = "visible";
    navTitle.style.opacity = 100;
  }else{
    if (navTitle.style.visibility == "hidden") {
    navTitle.style.visibility = "visible";
    navTitle.style.opacity = 100;
    } else {
      navTitle.style.visibility = "hidden";
      navTitle.style.opacity = 0;
    }
  }
}

// Library Songs
for(let i = 0; i < songs.length; i++){
  let libraryTag = `
  <div class="library-song" song-index="${i}">
    <img src="${songs[i].img_thumb}" alt="${songs[i].title}">
    <div class="library-description">
      <h3>${songs[i].title}</h3>
      <h4>${songs[i].artist}</h4>
    </div>
  </div>`;
  libraryList.insertAdjacentHTML('beforeend',libraryTag); 
}

//Player
var player;
var currentSong = 0;
var songsID = songs.map(song => song.video_id);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("audio", {
    height: "0",
    width: "0",
    playerVars: {
      playsinline: 1,
      origin: "https://www.youtube.com"
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  clearInterval(time_update_interval);
  event.target.loadPlaylist({playlist: songsID});
  updatePlayerDisplay();

  var time_update_interval = setInterval(function () {
    progressBar.value = player.getCurrentTime();
    progressBar.max = player.getDuration();
    updatePlayerDisplay();
  }, 1000)
  nowPlaying(currentSong);
}

function onPlayerStateChange(event) {
  if (event.data === 0) {
    toggleButton(false);
  }
  nowPlaying(player.getPlaylistIndex());
}

function toggleButton(status) {
  var icon = document.getElementById("music-icon").classList;
  if (status){
    icon.remove("fa-play");
    icon.add("fa-pause");
    document.getElementById("song-image").classList.add("playing");
  }else{
    icon.remove("fa-pause");
    icon.add("fa-play");
    document.getElementById("song-image").classList.remove("playing");
  }
}

function toggleAudio() {
  if (player.getPlayerState() == 1 || player.getPlayerState() == 3) {
    player.pauseVideo();
    toggleButton(false);
  } else {
    player.playVideo();
    toggleButton(true);
  }
}

function prevSong() {
  currentSong--;
  if (currentSong < 0) {
    currentSong = songsID.length - 1;
    player.setLoop(true);
  }
  player.previousVideo();
  toggleButton(true);
  nowPlaying(currentSong);
}

function nextSong() {
  currentSong++;
  if(currentSong > songsID.length - 1) {
    currentSong = 0;
    player.setLoop(true);
  }
  player.nextVideo();
  toggleButton(true);
  nowPlaying(currentSong);
}

//Library When Clicked
const librarySong = document.querySelectorAll(".library-song");
function nowPlaying(currentSong) {
  for(let i = 0; i < songs.length; i++){
    if(librarySong[i].classList.contains('active')){
      librarySong[i].classList.remove("active");
    }
    
    if(librarySong[i].getAttribute('song-index') == currentSong){
      librarySong[i].classList.add('active');
    }

    librarySong[i].setAttribute("onclick", "clicked(this)");
  }

  var songTitle  = songs[currentSong].title;
  var songArtist = songs[currentSong].artist;
  var songImage = songs[currentSong].img_thumb;
  document.getElementById("song-title").innerHTML = songTitle;
  document.getElementById("song-artist").innerHTML = songArtist;
  document.getElementById("song-image").src = songImage;
}

//Current Time/Duration and Progress Bar
function updatePlayerDisplay() {
  // var animationBar = Math.round((player.getCurrentTime() * 100) / player.getDuration());
  var animationBar = (player.getCurrentTime() / player.getDuration()) * 100;
  document.getElementById('current-time').innerHTML = getTime(player.getCurrentTime());
  document.getElementById('duration').innerHTML = getTime(player.getDuration());
  document.querySelector(".animate-track").style.transform = `translateX(${animationBar}%)`;
}


function getTime(time) {
  let minute = Math.floor(time / 60);
  let second = ("0" + Math.floor(time % 60)).slice(-2);
  return `${minute}:${second}`;
};

progressBar.addEventListener('change', function(e) {
  // var newTime = player.getDuration() * (e.target.value / 100);
  var newTime = e.target.value;
	player.seekTo(newTime);
});

//Pick Song in Library
function clicked(element){
  let getIndex = element.getAttribute("song-index");
  currentSong = getIndex;
  player.playVideoAt(currentSong);
  nowPlaying(currentSong);
  toggleButton(true);
}

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
