const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server);
const { joinUser, removeUser } = require("./public/users");
 const { createRoom, checkRoom, roomNow, getRoomtype, checkRoomname } = require("./public/roomsmanage");
const collabNamespace = io.of("/collab");
const chatNamespace=io.of("/chat");
const roomNamespace=io.of("/room");
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/homepage.html');
});
app.use(express.static(__dirname + "/public"));
server.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

// let thisRoom = "";

function onConnection(socket) {
  socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));
}

collabNamespace.on("connection", onConnection);

chatNamespace.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log(msg);
    // thisRoom = msg.room;
    chatNamespace.emit("chat message", { msg: msg, id: socket.id });
  });
});

chatNamespace.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // console.log(user);
    const user = removeUser(socket.id);
    if (user) {
      console.log(user.username + " has left");
    }
    console.log("disconnected");
  });
});
roomNamespace.on("connection", (socket) => {
  socket.on("create room", (room) => {
  console.log(room);
  console.log("tes tes");
  let isAvailable = checkRoomname(room.roomname);
  console.log(isAvailable);
  if(isAvailable){
    createRoom(room.roomname, room.roompass, room.roomtype);
    socket.emit("sukses masuk", {type : room.roomtype});
  }
  else{
    socket.emit("room ada", room.roomname);
  }
  console.log(roomNow());
  });
  socket.on("join room", (room) => {
    console.log(room);
    let isAvailable = checkRoom(room.roomname, room.roompass);
    console.log(isAvailable);
    if(isAvailable){
      socket.emit('password feedback', {status:'correct',type:getRoomtype(room.roomname) });
      console.log(getRoomtype(room.roomname));
    }
    else{
      socket.emit('password feedback', {status:'wrong'});
    }
  });
});