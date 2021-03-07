


var nameRoom = document.getElementById("croom");
var passRoom = document.getElementById("cpwd");
var radios = document.getElementsByName("customRadio");
var button = document.getElementById("createRoom");
var jNameRoom = document.getElementById("jroom");
var jPassRoom = document.getElementById("jpwd");
var socket = io("/room");

function checkRadio() {
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
}
function createClick() {
  console.log("creating room..");
  socket.emit("create room", {
    roomname: nameRoom.value,
    roompass: passRoom.value,
    roomtype: checkRadio(),
  });
  
}
function joinClick() {
    console.log("checking");
    socket.emit("join room", {
      roomname: jNameRoom.value,
      roompass: jPassRoom.value,
    });
  }
  socket.on("password feedback", function (msg){
    console.log(msg);
    if(msg.status=="correct"){
        location.replace("/"+msg.type+".html");
    }
    else{
        alert("Room atau Password salah!");
    }
  });
  socket.on("room ada", function(name){
    alert("room dengan nama "+ name+" Sudah ada!");
  });
  socket.on("sukses masuk",function(msg) {
    location.replace("/"+msg.type+".html");
  });

