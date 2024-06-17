const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Agregar nuevo jugador al objeto de jugadores
  players[socket.id] = {
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
  };

  // Enviar jugadores actuales al nuevo jugador
  socket.emit('currentPlayers', players);

  // Anunciar nuevo jugador a otros jugadores
  socket.broadcast.emit('newPlayer', { playerId: socket.id, playerData: players[socket.id] });

  // Manejar desconexión de jugador
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });

  // Manejar movimiento de jugador
  socket.on('playerMoved', (data) => {
    if (players[socket.id]) {
      players[socket.id].position = data.position;
      players[socket.id].rotation = data.rotation;
      socket.broadcast.emit('playerMoved', { playerId: socket.id, position: data.position, rotation: data.rotation });
    }
  });
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});
