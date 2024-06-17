const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:3000", // Permitir solicitudes desde este origen
    methods: ["GET", "POST"]
  }
});

let players = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Añadir nuevo jugador
  players[socket.id] = {
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
  };

  // Enviar jugadores actuales al nuevo jugador
  socket.emit('currentPlayers', players);

  // Anunciar nuevo jugador a otros jugadores
  socket.broadcast.emit('newPlayer', { playerId: socket.id, playerData: players[socket.id] });

  // Manejar movimiento de jugador
  socket.on("playerMoved", (data) => {
    if (players[socket.id]) {
      players[socket.id].position = data.position;
      players[socket.id].rotation = data.rotation;
      socket.broadcast.emit("playerMoved", { playerId: socket.id, position: data.position, rotation: data.rotation });
    }
  });

  // Manejar desconexión de jugador
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });
});
