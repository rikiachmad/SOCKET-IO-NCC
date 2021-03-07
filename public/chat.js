let userName = prompt("whats your name");
// let room = prompt("room name");
let ID = "";
var welcome = document.getElementById("welcome");
welcome.append(userName + "!");
var socket = io();
// socket.emit("join room", { username: userName, roomName: room });
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var chatbox = document.getElementById("chatbox");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", {
      value: input.value,
      user: userName,
    });
    input.value = "";
    input.focus();
  }
});
socket.on("chat message", function (msg) {
  console.log(msg);
  var item = document.createElement("li");
  item.textContent = msg.msg.user + " : " + msg.msg.value;
  messages.appendChild(item);
  chatbox.scrollTo(0, document.body.scrollHeight);
});