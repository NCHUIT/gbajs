
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('.'));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('join', function(room_name) {
    socket.join(room_name);
    console.log(`a user joined ${room_name}`);

    socket.on('key', function(event) {
      if(event.keyCode && event.type) {
        io.in(room_name).emit('key', event);
        console.log(`Sending ${event.type} '${event.keyCode}'`);
      }
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

