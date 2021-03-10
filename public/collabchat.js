var sockets = io("/room");
var welcome = document.getElementById("collabWelcome");
var messages = document.getElementById("collabMessages");
var form = document.getElementById("collabForm");
var input = document.getElementById("collabInput");
var chatbox = document.getElementById("collabChatbox");
var userName = document.getElementById("usr");
var room = "";

function getUsername() {
  welcome.append(userName.value + "!");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    console.log("masukkk");
    sockets.emit("collabchat message", {
      user: userName.value,
      value: input.value,
      roomname: room,
    });
    console.log(input.value);
    console.log(userName);
    input.value = "";
    input.focus();
  }
});
sockets.on("collabchat", function (msg) {
  console.log("pesan diterima");
  var item = document.createElement("li");
   item.textContent = msg.msg.user + " : " + msg.msg.value;
  messages.appendChild(item);
  chatbox.scrollTo(0, document.body.scrollHeight);
});

sockets.on("roomname", (msg)=>{
  console.log(msg);
  room=msg;
  });