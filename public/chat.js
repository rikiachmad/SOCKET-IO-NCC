var button = document.getElementById("usrname");
let ID = "";
var welcome = document.getElementById("welcome");

var sockets = io("/chat");
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var chatbox = document.getElementById("chatbox");
var userName = document.getElementById("usr");

function getUsername() {
  welcome.append(userName.value + "!");
  sockets.emit('send data', userName.value);
}

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

