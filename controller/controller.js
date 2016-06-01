
var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
function info(msg){
  document.getElementById('info').innerHTML = msg;
}

var socket = io(), room_name;
function join() {
  if(room_name){
    socket.emit('join', room_name);
    document.getElementById('room_name').innerHTML = 'Room: ' + room_name;
  }
}
function sendKey(event) {
  var keyEvent = {keyCode: event.keyCode, type: event.type};
  // console.log("Sending", keyEvent);
  socket.emit('key', keyEvent);
}
window.addEventListener("keydown", sendKey);
window.addEventListener("keyup", sendKey);

socket.on('banned', function() {
  document.getElementById('banned').innerHTML = 'banned!';
  setTimeout(function() {
    document.getElementById('banned').innerHTML = '';
  },4000);
});

// virtual gamepad for mobile
var KEYCODE_LEFT = 37, KEYCODE_UP = 38, KEYCODE_RIGHT = 39, KEYCODE_DOWN = 40, KEYCODE_START = 13, KEYCODE_SELECT = 220, KEYCODE_A = 90, KEYCODE_B = 88, KEYCODE_L = 65, KEYCODE_R = 83;
window.onload = function initGamepad() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if(isMobile && canvas.height > canvas.width){
    info("Please use Landscape and refresh<br>請打橫並重新整理網頁！");
    return;
  }
  
  room_name = prompt("Room name:")
  socket.on('connect', join);
  join();
  
  if(!isMobile){
    info("Keybindings for keyboard:<br>  z: A<br>  x: B<br>  a: L<br>  s: R<br>  Enter: Start<br>  '\\':Select");
    return;
  }

  function genButtonSetting(x, y, label, bgColor, keyCode, radius) {
    return {
      offset: { x: x, y: y },
      label: label,
      radius: radius || '10%',
      stroke: 2,
      fontSize: 20,
      backgroundColor: bgColor,
      fontColor: '#fff',
      touchStart: function() {
        sendKey({keyCode: keyCode, type: "keydown"});
      },
touchEnd: function() {
        sendKey({keyCode: keyCode, type: "keyup"});
      }
    };
  }
  GameController.init({
    canvas: 'canvas',
    left: {
      type: 'buttons',
      position: {
        top: '35%',
        left: '15%',
      },
      buttons: [
        genButtonSetting(0, '-15%', '↑', 'white', KEYCODE_UP),
        genButtonSetting('-15%', 0, '←', 'white', KEYCODE_LEFT),
        genButtonSetting(0, '15%', '↓', 'white', KEYCODE_DOWN),
        genButtonSetting('15%', 0, '→', 'white', KEYCODE_RIGHT),
      ]
    },
    right: {
      type: 'buttons',
      position: { right: '25%', bottom: '55%' },
      buttons: [
        genButtonSetting('-5%', '-27.5%', 'A', 'green', KEYCODE_A, '15%'),
        genButtonSetting('-5%', '3%', 'B', 'red', KEYCODE_B, '15%'),
        genButtonSetting('-20%', '-40%', 'L', 'yellow', KEYCODE_L),
        genButtonSetting('20%', '-40%', 'R', 'yellow', KEYCODE_R),
        genButtonSetting('-20%', '25%', 'Start', 'blue', KEYCODE_START),
        genButtonSetting('20%', '25%', 'Select', 'blue', KEYCODE_SELECT),
      ]
    }
  });
};
