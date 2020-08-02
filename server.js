var express = require('express');
var socket_module = require('socket.io');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));
var io = socket_module(server);
io.sockets.on('connection', newConnection)

var isPlaying = false;
var groupNum = 0;
var song_num = 0;

var fs = require('fs');
var files = fs.readdirSync('public/assets/');
var formatted_files = []
for(var i = 0; i < files.length; i++){
  formatted_files.push(files[i].substring(0,files[i].length-4));
}

function newConnection(socket){
  console.log("Connected user: " + socket.id);
  socket.emit('song_list', {items: formatted_files, num: song_num});
  socket.on('play', ()=>{
    if(isPlaying){return;}
    isPlaying = true;
    io.in(groupNum.toString()).emit('play_resp', Date.now()+5000);
  });

  socket.on('ready', ()=>{
    if(isPlaying){return;}
    socket.join(groupNum.toString());
  });

  socket.on('reset', ()=>{
    isPlaying = false;
    io.emit('stop');
    groupNum++;

  });

  socket.on('request_song', (i)=>{
    io.emit('request_granted', i);
    song_num = i;
  });
}