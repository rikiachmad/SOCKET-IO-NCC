# Penugasan Kedua Camin NCC

## Server

Untuk server pada project ini menggunakan file server.js sebagai server utama. Terdapat beberapa namespace pada server yang digunakan untuk endpoint yang berbeda.

## Whiteboard dan Chat Collaborative untuk semua user

Endpoint pertama digunakan untuk seluruh user agar dapat menggambar di whiteboard sesukanya. Untuk endpoint yang pertama ini homepage.html digunakan sebagai endpoint ini sekaligus halaman utaman pada saat user tergabung di server.

Pada sisi server, kita menginisiasi 3 namespace untuk page ini yaitu 
``` server
const collabNamespace = io.of("/collab");
const chatNamespace = io.of("/chat");
const roomNamespace = io.of("/room");
```
<br>
tiga namespace tersebut digunakan untuk mengakses papan tulis collaborative, chat untuk semua user, dan pembuatan private room.

source code dibawah ini digunakan untuk chat collaborative seluruh user pada bagian server side.
``` chat collaborative all user
chatNamespace.on("connection", function (socket) {
  console.log("connected");
  socket.on("chat message", function (msg) {
    console.log(msg);
    chatNamespace.emit("chat message", { msg: msg, id: socket.id });
  });
});
chatNamespace.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
```
<br>

lalu untuk client side menggunakan chat.js source code nya seperti berikut.
``` chat.js
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    console.log("masukkk");
    sockets.emit('chat message', {
      user: userName.value,
      value: input.value,
    });
    console.log(input.value);
    console.log(userName.value);
    input.value = "";
    input.focus();
  }
});
sockets.on("chat message", function (msg) {
  console.log(msg);
  var item = document.createElement("li");
   item.innerHTML = "<strong>"+msg.msg.user +"</strong>" + " : " + msg.msg.value;
  messages.appendChild(item);
  chatbox.scrollTo(0, document.body.scrollHeight);
});
```
<br>
dan untuk drawing whiteboard nya menggunakan source code drawing,js dibawah ini pada client side.
``` drawing all user
(function () {
  const socket = io("/collab");
  var canvas = document.getElementsByClassName("whiteboard")[0];
  var context = canvas.getContext("2d");
  var current = {
    color: getRandomColor(),
  };
  var drawing = false;

  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);
  canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);
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
    });
  }

  function onMouseDown(e) {
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }

  function onMouseUp(e) {
    if (!drawing) {
      return;
    }
    drawing = false;
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
  }

  function onMouseMove(e) {
    if (!drawing) {
      return;
    }
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    current.x = e.clientX;
    current.y = e.clientY;
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
      "cyan",
      "maroon",
      "coral",
      "salmon",
    ];
    var color = letters[Math.floor(Math.random() * 14)];
    return color;
  }
})();
```
<br>

untuk source code server side nya sebagai berikut,
``` whiteboard
function onConnection(socket) {
  socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));
}

collabNamespace.on("connection", onConnection);
```
## Whiteboard dan Chat Collaborative Untuk Private Room

Pada endpoint kedua ini, hanya user tertentu yang memiliki room name dan room password saja yang dapat masuk ke dalam private room. Ada pula fitur create room untuk membuat room collaborative dengan password.

webpage utama pada private collaborative whiteboard disini menggunakan collaborative.html dimana digunakan untuk membuat front end dari room ini.

pada server side digunakan source code berikut untuk mengatur whiteboard collaborative private ini.
``` collab server side
  socket.on("collabchat message", function (msg) {
    console.log(msg);
    thisRoom = msg.roomname;
    console.log("this room: " + thisRoom);
    roomNamespace.to(thisRoom).emit("collabchat", { msg: msg, id: socket.id });
  });
```
dan client side menggunakan collabchat.js.
source code diatas digunakan untuk chat dalam private room. Sedangkan untuk whiteboardnya sendiri pada serverside menggunakan source code sebagai berikut
``` collab drawing server
boardNamespace.on("connection", function (socket) {
  socket.join(thisRoom);
  socket.emit("roomname", thisRoom);
  socket.on("drawing", (data) => {
    thisRoom = data.roomname;
    console.log("drawing room: " + thisRoom);
    socket.to(thisRoom).emit("drawing", data);
  });
});
```
dan untuk client side nya bisa dilihat di collabboard.js

## Whiteboard Broadcast Room
Endpoint yang terakhir digunakan untuk membuat private room dengan tipe broadcast room yaitu hanya user yang membuat room tersebut lah yang dapat menggambar di boardnya. Sedangkan untuk user yang join ke dalam room tersebut hanya dapat melihat whiteboard adn tidak dapat menggambar. Untuk chat nya seluruh user dengan password room tersebut dapat menulis di kolom chat. Fitur create room dengan pilihan broadcast room juga tersedia di tombol 'create room'.

untuk webpage front end nya menggunakan broadcast.html
dan source code untuk membuat broadcast whiteboard pada server side
``` broadcast whiteboard
broadNamespace.on("connection", function (socket) {
  socket.join(thisRoom);
  console.log(status);
  console.log(thisRoom);
  socket.emit("status", status);
  socket.emit("roomname", thisRoom);
  socket.on("drawing", (data) => {
    console.log(data);
    thisRoom = data.roomname;
    socket.to(thisRoom).emit("drawing", data);
  });
});
```
<br>
dan pada client side menggunakan broadcastboard.js
untuk chat nya sendiri tetap menggunakan collabchat.js

## Penjelasan Tambahan
Untuk file rooms.js dan roomsmanage.js digunakan untuk backend dari fitur create room dan join room yang terdiri dari pengecekan roomname dan password untuk dapat membuat room ataupun join room.

Adapula index.html, collab-for-iframe.html, dam broadcast-for-iframe.html digunakan untuk canvas yang nantinya akan dimasukkan ke page utama melalui iframe. Sehingga ukuran canvas dapat disesuaikan menggunakan styles.css tanpa harus merubah source code dari canvas itu sendiri.

Dan untuk pemilihan warna untuk setiap user di random (kecuali whiteboard broadcast menggunakan warna hitam) sehingga ada kemungkinan user akan mendapatkan warna yang sama.




