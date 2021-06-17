//This is a slightly modified verion of this => https://github.com/mizanxali/uno-online/blob/master/users.js
//The code found above was made based off of this tutorial => https://www.youtube.com/watch?v=jD7FnbI76Hg

const users = [];

const addUser = ({id, name, room, winPhrase}) => {
  const newUser = {id, name, room, winPhrase};
  users.push(newUser);
  return newUser
}

const removeUser = id => {
  const removeIndex = users.findIndex(user => user.id === id);
  if(removeIndex!==-1)
    return users.splice(removeIndex, 1)[0]
}

const getUser = id => {
  return users.find(user => user.id === id);
}

const getUsersInRoom = room => {
  return users.filter(user => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }
