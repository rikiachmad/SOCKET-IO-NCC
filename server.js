const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server);
const { joinUser, removeUser, getName } = require("./public/users");
const {
  createRoom,
  checkRoom,
  roomNow,
  getRoomtype,
  checkRoomname,
} = require("./public/roomsmanage");
const collabNamespace = io.of("/collab");
const chatNamespace = io.of("/chat");
const roomNamespace = io.of("/room");
const boardNamespace = io.of("/collabboard");
const broadNamespace = io.of("/broadcast");
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/homepage.html");
});
app.use(express.static(__dirname + "/public"));
server.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
let thisRoom = "";
let status = "";
let newName = "";
function onConnection(socket) {
  socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));
}

collabNamespace.on("connection", onConnection);
boardNamespace.on("connection", function (socket) {
  socket.join(thisRoom);
  socket.emit("roomname", thisRoom);
  socket.on("drawing", (data) => {
    thisRoom = data.roomname;
    console.log("drawing room: " + thisRoom);
    socket.to(thisRoom).emit("drawing", data);
  });
});
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

roomNamespace.on("connection", (socket) => {
  socket.emit("roomname", thisRoom);
  socket.emit("username", newName);
  socket.join(thisRoom);
  socket.on("create room", (room) => {
    console.log(room);
    let isAvailable = checkRoomname(room.roomname);
    console.log(isAvailable);
    if (isAvailable) {
      createRoom(room.roomname, room.roompass, room.roomtype);
      newName = (getName(socket.id));
      socket.emit("sukses masuk", { type: room.roomtype, name: room.roomname });
      //let Newuser = joinUser(socket.id, newName);
      thisRoom = room.roomname;
      status = "master";
      console.log("current croom: " + thisRoom);
    } else {
      socket.emit("room ada", room.roomname);
    }
    console.log(roomNow());
  });
  socket.on("join room", (room) => {
    console.log(room);
    let isAvailable = checkRoom(room.roomname, room.roompass);
    console.log(isAvailable);
    if (isAvailable) {
      socket.emit("password feedback", {
        status: "correct",
        type: getRoomtype(room.roomname),
      });
      console.log(getRoomtype(room.roomname));
      //let Newuser = joinUser(socket.id, newName, room.roomname);
      thisRoom = room.roomname;
      status = "follower";
      console.log("current jroom: " + thisRoom);
    } else {
      socket.emit("password feedback", { status: "wrong" });
    }
  });

  socket.on("collabchat message", function (msg) {
    console.log(msg);
    thisRoom = msg.roomname;
    console.log("this room: " + thisRoom);
    roomNamespace.to(thisRoom).emit("collabchat", { msg: msg, id: socket.id });
  });
});
