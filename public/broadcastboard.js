(function () {
  const socket = io("/broadcast");
  var canvas = document.getElementsByClassName("whiteboard")[0];
  var context = canvas.getContext("2d");
  var current = {
    color: "black",
  };
  var drawing = false;
  var status = "";
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);
  canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

  socket.on("roomname", (msg) => {
    room = msg;
  });
  socket.on("status", (msg) => {
    status = msg;
  });
  socket.on("drawing", onDrawingEvent);

  window.addEventListener("resize", onResize, false);
  onResize();

  function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit("drawing", {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      roomname: room,
    });
  }

  function onMouseDown(e) {
    if (status == "master") {
      drawing = true;
      current.x = e.clientX;
      current.y = e.clientY;
    }
  }

  function onMouseUp(e) {
    if (status == "master") {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    }
  }

  function onMouseMove(e) {
    if (status == "master") {
      if (!drawing) {
        return;
      }
      drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
      current.x = e.clientX;
      current.y = e.clientY;
    }
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
      var time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data) {
      console.log(status);
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function getRandomColor() {
    var letters = [
      "black",
      "blue",
      "red",
      "green",
      "yellow",
      "purple",
      "grey",
      "pink",
      "brown",
      "orange",
    ];
    var color = letters[Math.floor(Math.random() * 9)];
    return color;
  }
})();
