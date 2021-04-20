const express = require("express");
const app = express();
const http = require("http").createServer(app);
const router = require("./routes/router");
const io = require("socket.io")(http);
const { initGame, gameLoop, getUpdatedVelocity } = require("./game");
const { FRAME_RATE } = require("./constants");
const { lobbyid } = require("./utils");

const port = process.env.PORT || 3000;

app.use(router);
app.use(express.static(`${__dirname}/public`));

app.set("view engine", "ejs");
app.set("views", "view");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
    client.on("keydown", handleKeydown);
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);

    function handleJoinGame(gameCode) {
        const room = io.sockets.adapter.rooms.get(`${gameCode}`);

        let allUsers;

        if (room) {
            allUsers = room;
        }

        let numClients = 0;

        if (allUsers) {
            numClients = io.sockets.adapter.rooms.get(`${gameCode}`).size;
        }

        // Nobody waiting
        if (numClients === 0) {
            return client.emit("unknownCode");
        } else if (numClients > 1) {
            return client.emit("tooManyPlayers");
        }

        clientRooms[client.id] = gameCode;
        client.join(gameCode);
        client.number = 2;
        client.emit("init", 2);

        startGameInterval(gameCode);
    }

    async function handleNewGame() {
        let roomName = lobbyid(5);
        clientRooms[client.id] = roomName;
        client.emit("gameCode", roomName);

        state[roomName] = initGame();

        client.join(roomName);
        client.number = 1;
        client.emit("init", 1);
    }

    function handleKeydown(keyCode) {
        const roomName = clientRooms[client.id];

        if (!roomName) {
            return;
        }

        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            return;
        }

        // If game is over prevent server from crashing
        if (!state[roomName]) {
            return;
        }

        const vel = getUpdatedVelocity(keyCode, client.id);

        if (vel) {
            state[roomName].players[client.number - 1].vel = vel;
        }
    }
});

async function startGameInterval(roomName) {
    let timer = 6;
    const countdown = setInterval(() => {
        timer--;
        io.sockets.in(roomName).emit("countdown", timer);
        if (timer === 0) {
            clearInterval(countdown);
            const intervalId = setInterval(() => {
                const winner = gameLoop(state[roomName]);

                if (!winner) {
                    emitGameState(roomName, state[roomName]);
                } else {
                    emitGameover(roomName, winner);
                    state[roomName] = null;
                    clearInterval(intervalId);
                }
            }, 1000 / FRAME_RATE);
        }
    }, 1000);
}

function emitGameState(roomName, state) {
    io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameover(roomName, winner) {
    io.sockets.in(roomName).emit("gameOver", JSON.stringify({ winner }));
}

http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});