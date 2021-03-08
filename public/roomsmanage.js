let rooms = [];

function createRoom(name, pass, type) {
    const room = {
      roomname: name,
      roompass: pass,
      roomtype: type,
    };
    rooms.push(room);
  }
  function roomNow(){
    return rooms;
  }
  function checkRoom(roomname, password) {
    console.log("masuk");
    for (var i = 0; i < rooms.length; i++) {
      console.log("roomcheck");
      console.log(roomname);
      console.log(rooms[i].roomname);
      console.log(rooms[i].roompass);
      console.log(password);
      if (roomname == rooms[i].roomname) {
        if(password == rooms[i].roompass){
          return true;
        }
        else return false;
      }
    }
    return false;
  }
  function checkRoomname(name) {
    console.log("masuk ga");
    for (var i = 0; i < rooms.length; i++) {
      console.log("roomcheck");
      console.log(name);
      console.log(rooms[i].roomname);
      if (rooms[i].roomname == name) {
        return false;
      }
    }
    return true;
  }
function getRoomtype(name){
  for(var i =0; i<rooms.length; i++){
    if(rooms[i].roomname == name){
      return rooms[i].roomtype;
    }
  }
}
   module.exports = { createRoom, checkRoom, roomNow, getRoomtype, checkRoomname };