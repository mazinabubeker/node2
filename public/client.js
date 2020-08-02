// var {Howl, Howler};
// require(['howler'], function (foo) {
//   {Howl, Howler} = foo;
// });

var socket;
var sounds = [];
var isPlaying = false;
var songList = [];
var allsongs;
var song_num = 0;

function readyRequest(){
  socket.emit('ready');
  document.getElementById('song-container').style.pointerEvents = "auto";
  // document.getElementById('reset-btn').style.pointerEvents = "auto";
  document.getElementById('play-btn').style.pointerEvents = "auto";
  document.body.style.backgroundColor = "#ddd";
}

function playRequest(){
  socket.emit('play');
}

function reset(){
  socket.emit('reset');
}

function stop(){
  sounds[song_num].stop();
  document.getElementById('song-container').style.pointerEvents = "none";
  // document.getElementById('reset-btn').style.pointerEvents = "none";
  document.getElementById('play-btn').style.pointerEvents = "none";
  document.body.style.backgroundColor = "#fff";
  song_num = 0;
  allsongs[song_num].style.backgroundColor = "#ff928a";
  for(var i = 0; i < allsongs.length; i++){
    if(song_num!=i){
      allsongs[i].style.backgroundColor = "#fff";
    }
  }
}

function play(timeToPlay){
  setTimeout(()=>{
    sounds[song_num].play();
  }, timeToPlay - Date.now())
  document.body.style.backgroundColor = "#9dcff5";
  document.getElementById('song-container').style.pointerEvents = "none";
}


$(document).ready(function(){
  socket = io();
  socket.on('play_resp', play);
  socket.on('stop', stop);
  socket.on('song_list', list=>{
    document.getElementById('song-container').innerHTML = '';
    songList = list.items;
    for(var i = 0; i < songList.length; i++){
      sounds.push(new Howl({
        src: ['assets/' + songList[i].split('$')[0] + '$' + songList[i].split('$')[1] + '.mp3']
      }));
    }
    song_num = list.num;
    console.log(songList);
    for(var i = 0; i < songList.length; i++){
      let title = songList[i].split('$')[0];
      let artist = songList[i].split('$')[1];
      let new_song_element = `<div class="song-item">` + title + `<span class="songname">` + artist + `</span></div>`;
      document.getElementById('song-container').insertAdjacentHTML('beforeend', new_song_element);
    }
    allsongs = document.getElementsByClassName('song-item');
    allsongs[0].addEventListener('click', ()=>{
      socket.emit('request_song', 0);
    });
    allsongs[1].addEventListener('click', ()=>{
      socket.emit('request_song', 1);
    });
    allsongs[2].addEventListener('click', ()=>{
      socket.emit('request_song', 2);
    });
    allsongs[song_num].style.backgroundColor = "#ff928a";
  });
  
  socket.on('request_granted', num=>{
    song_num = num;
    console.log('wow');
    allsongs[song_num].style.backgroundColor = "#ff928a";
    for(var i = 0; i < allsongs.length; i++){
      if(song_num!=i){
        allsongs[i].style.backgroundColor = "#fff";
      }
    }
  });

  
  
  
});


// LAST THING - When server tells the client to play, add a 100ms delay and play after the difference
//              of the current time and target time to sync.
