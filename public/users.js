let users = [];

function joinUser(socketId, userName) {
  const user = {
    socketID: socketId,
    username: userName,
  };
  users.push(user);
}

function removeUser(id) {
  const getID = (users) => users.socketID === id;
  const index = users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
function getName(id){
  for(var i=0; i<users.length; i++){
    if(users[i].socketID == id){
      return users[i].username;
    }
  }
}

module.exports = { joinUser, removeUser, getName };
