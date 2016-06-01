
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const KEYCODE2NAME = {37:'LEFT', 38:'UP', 39:'RIGHT', 40:'DOWN', 13:'START', 220:'SELECT', 90:'A', 88:'B', 65:'L', 83:'R'};

app.use(express.static('.'));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('join', function(joining_room_name) {
    if(typeof joining_room_name !== 'string') return;
    var room_name = joining_room_name.replace(/^\./,'');
    var good = (joining_room_name == room_name);
    socket.join(room_name);
    console.log(`a user joined ${joining_room_name}`);

    if(!good){
      good = -5;
      setInterval(function() { good--; }, 4000);
    }

    socket.on('key', function(event) {
      if(event.keyCode && event.type && good) {
        io.in(room_name).emit('key', event);
        console.log(`Sending ${event.type} ${KEYCODE2NAME[event.keyCode]} (${event.keyCode}) to '${room_name}', good = ${good}`);
        if(event.type == 'keyup' && good < 0)
          good++;
      }
      else socket.emit('banned');
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

