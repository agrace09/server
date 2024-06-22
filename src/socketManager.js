"use strict";

function handleSocketConnection(socket, io, states) {
  console.log(
    "Player joined with ID",
    socket.id,
    ". There are " + io.engine.clientsCount + " players connected."
  );

  // Enviar el estado actual al nuevo jugador
  socket.emit("update-states", states);

  socket.on("player-moving", (transforms) => {
    // Incluye el estado de la animación en el objeto transforms
    socket.broadcast.emit("player-moving", transforms);
  });

  // Manejar cambios en el estado de las puertas landLevel
  socket.on("change-door-state", (newDoorStates) => {
    Object.assign(states.landLevelState.doorStates, newDoorStates);
    io.emit("update-states", states);
  });

  // Manejar cambios en el estado de las monedas de firelevel
  socket.on("change-coin-state", (newCoinStates) => {
    Object.assign(states.fireLevelState.coinStates, newCoinStates);
    io.emit("update-states", states);
  });

  // Manejar cambios en el estado de los corazones de firelevel
  socket.on("change-heart-state", (newHeartStates) => {
    Object.assign(states.fireLevelState.heartStates, newHeartStates);
    io.emit("update-states", states);
  });

  // Manejar cambios en el estado de los enemigos de firelevel
  socket.on("update-enemy-states", (newEnemyStates) => {
    Object.assign(states.fireLevelState.enemyStates, newEnemyStates);
    io.emit("update-states", states);
  });


  socket.on("disconnect", () => {
    console.log(
      "Player disconnected with ID",
      socket.id,
      ". There are " + io.engine.clientsCount + " players connected"
    );
  });
}

module.exports = { handleSocketConnection };
