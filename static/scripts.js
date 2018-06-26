'use strict';

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
  socket.emit('message', "I'm connected!");
});

socket.on('result', function(number) {
  number = number.toString();
  console.log(number);
  displayNumber(number);
});

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});
const displayNumber = function(number) {
  console.log(number);
  document.getElementById('number').innerHTML = number;
};
(function() {
  //variables
  const SCALE = 2;
  const COLOR = '#000';
  const WIDTH = 40;

  const canvas = document.getElementById('draw-canvas');
  const context = canvas.getContext('2d');

  let paths = new Array();
  let mouseDown = false;

  const clickPoint = function(e) {
    // Multiplying by scale to account for CSS scaling.
    return [(e.pageX - canvas.offsetLeft) * SCALE,
            (e.pageY - canvas.offsetTop) * SCALE];
  };

  canvas.ontouchstart = canvas.onmousedown = function(e) {
    e.preventDefault();
    mouseDown = true;
    paths.push([clickPoint(e)]);
    redraw();
  };

  window.onmousemove = window.ontouchmove = function(e) {
    e.preventDefault();
    if (mouseDown) {
      const thisPoint = clickPoint(e);
      const lastPath = paths[paths.length - 1];
      const lastPoint = lastPath[lastPath.length - 1];
      if (thisPoint[0] != lastPoint[0] || thisPoint[1] != lastPoint[1]) {
        lastPath.push(thisPoint);
        redraw();
      }
    }
  };

  window.onmouseup = window.ontouchend = window.ontouchcancel = function(e) {
    if (mouseDown) {
      askForPrediction();
      mouseDown = false;
    }
  };

  const clearButton = document.getElementById('clear-button');
    clearButton.onclick = clearButton.ontouchend = function(e) {
    mouseDown = false;
    paths = new Array();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  };

  const redraw = function() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  //brush settings
    //brush size
    context.lineJoin = 'round';
    context.lineCap = 'round';
    //brush colour
    context.strokeStyle = COLOR;
    context.fillStyle = COLOR;
    //brush width
    context.lineWidth = WIDTH;

    for (const path of paths) {
      context.beginPath();
      if (path.length == 1) {
          // This path consists of one point. Canvas will not draw a line with
          // just one point, so we draw a circle instead.
          const point = path[0];
          context.arc(point[0], point[1], WIDTH / 2, 0, 2 * Math.PI);
          context.fill();
      } else {
          context.moveTo.apply(context, path[0]);
          for (const point of path.slice(1)) {
              context.lineTo.apply(context, point);
          }
          context.stroke();
      }
    }
  };

  const askForPrediction = function() {
    sendImageToServer();
  };

  const sendImageToServer = function() {
    var canvas = document.getElementById('draw-canvas');
    var dataURL = canvas.toDataURL();
    console.log(dataURL);
    socket.emit('message', dataURL);
  };




})();
