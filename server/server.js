//This is a slightly modified verion of this => https://github.com/mizanxali/uno-online/blob/master/server.js
//The code found above was made based off of this tutorial => https://www.youtube.com/watch?v=jD7FnbI76Hg

const socketio = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const PORT = 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors())

io.on('connection', socket => {
  socket.on('join', (payload, callback) => {

    const newUser = addUser({
      id: socket.id,
      name: payload.player,
      room: payload.room,
      winPhrase: payload.winPhrase
    })

    socket.join(newUser.room);

    io.to(newUser.room).emit('roomData', {room: newUser.room, users: getUsersInRoom(newUser.room)});
    socket.emit('currentUserData', {name: newUser.name});
    callback();

    socket.on('initGameState', gameState => {
      const user = getUser(socket.id);
      if (user) {
        io.to(user.room).emit('initGameState', gameState);
      }
    })

    socket.on('updateGameState', gameState => {
      const user = getUser(socket.id);
      if (user) {
        io.to(user.room).emit('updateGameState', gameState);
      }
    })

    socket.on('sendMessage', (payload, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', {user: user.name, text: payload.message})
        //callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user)
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    })

  })
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}.`)
})
