const app = require("express")();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server);
const { joinUser, removeUser } = require("./users");
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

// let thisRoom = "";

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

 io.on('connection', onConnection);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log(msg);
    // thisRoom = msg.room;
    io.emit("chat message", { msg: msg, id: socket.id });
  });

});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // console.log(user);
    const user = removeUser(socket.id);
    if (user) {
      console.log(user.username + " has left");
    }
    console.log("disconnected");
  });
});

