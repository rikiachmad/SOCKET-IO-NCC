let users = [];

function joinUser(socketId, userName, color) {
  const user = {
    socketID: socketId,
    username: userName,
    color:color
  };
  users.push(user);
  return user;
}

function removeUser(id) {
  const getID = (users) => users.socketID === id;
  const index = users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
function findUser(id) {
  return users.find((user) => {
    user.id === id;
  });
}
function getRandomColor() {
  var letters = "123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getRandomColor() {
  var letters = "123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// function countUsers(){
//   return users.length;
// }
module.exports = { joinUser, removeUser, getRandomColor };