var express = require('express');
var socket_module = require('socket.io');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));
var io = socket_module(server);
io.sockets.on('connection', newConnection)

var isPlaying = false;
var groupNum = 0;

function newConnection(socket){
  console.log("Connected user: " + socket.id);
  socket.on('play', ()=>{
    if(isPlaying){return;}
    isPlaying = true;
    io.in(groupNum.toString()).emit('play_resp', Date.now()+100);
  });

  socket.on('ready', ()=>{
    socket.join(groupNum.toString());
  });

  socket.on('reset', ()=>{
    isPlaying = false;
    io.in(groupNum.toString()).emit('stop');
    groupNum++
    // io.in('ready_users').leave('ready_users');
    // Stop playing the song for "ready_users" in new function stop with document.body.bgnd color white
    // clear the group "ready_users"
    
  });

}