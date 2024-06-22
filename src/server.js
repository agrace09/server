"use strict";
const { Server } = require("socket.io");
const { handleSocketConnection } = require("./socketManager");
const { initializeStates } = require("./stateManager");

const clientURLLocalhost = "http://localhost:3000";
const clientUrlDeploy = "https://sphere-websockets-r3f-client.vercel.app";

const port = 8080;

const io = new Server({
  cors: {
    origin: [clientURLLocalhost, clientUrlDeploy],
  },
});

const initialStates = initializeStates();

io.listen(port);

io.on("connection", (socket) => {
  handleSocketConnection(socket, io, initialStates);
});
