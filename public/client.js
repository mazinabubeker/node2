// var {Howl, Howler};
// require(['howler'], function (foo) {
//   {Howl, Howler} = foo;
// });

var socket, sound;
var isPlaying = false;

function readyRequest(){
  socket.emit('ready');
  document.body.style.backgroundColor = "#d1d1d1";
}

function playRequest(){
  socket.emit('play');
}

function reset(){
  socket.emit('reset');
}

function stop(){
  sound.stop();
  document.body.style.backgroundColor = "#fff";
}

function play(timeToPlay){
  setTimeout(()=>{
    sound.play();
  }, timeToPlay - Date.now())
  document.body.style.backgroundColor = "#9dcff5";
}


$(document).ready(function(){
  socket = io();
  socket.on('play_resp', play);
  socket.on('stop', stop);
  
  sound = new Howl({
    src: ['assets/song2.mp3']
  });
});


// LAST THING - When server tells the client to play, add a 100ms delay and play after the difference
//              of the current time and target time to sync.




