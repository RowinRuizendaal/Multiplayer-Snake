const express = require('express')
const app = express()
const http = require('http').createServer(app)
const router = require('./routes/router')
const io = require('socket.io')(http)
const { initGame, gameLoop, getUpdatedVelocity } = require('./game')
const { FRAME_RATE } = require('./constants')
const { makeid } = require('./utils')



const port = process.env.PORT || 3000;



app.use(router);
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');
app.set('views', 'view');


const state = {}
const clientRooms = {}

io.on('connection', client => {

    client.on('keydown', handleKeydown)
    client.on('newGame', handleNewGame)
    client.on('joinGame', handleJoinGame)

    function handleJoinGame(gameCode) {
        const room = io.sockets.adapter.rooms[gameCode]

        let allUsers;

        if (room) {
            allUsers = room.sockets
        }

        let numClients = 1

        if (allUsers) {
            numClients = Object.keys(allUsers).length
        }

        // Nobody waiting
        if (numClients === 0) {
            client.emit('unknownCode')
        } else if (numClients > 1) {
            client.emit('tooManyPlayers')
        }

        clientRooms[client.id] = gameCode
        client.join(gameCode)
        client.number = 2
        client.emit('init', 2)

        startGameInterval(gameCode)
    }

    function handleNewGame() {
        let roomName = makeid(5)
        console.log(roomName)
        clientRooms[client.id] = roomName
        client.emit('gameCode', roomName)

        state[roomName] = initGame()

        client.join(roomName)
        client.number = 1;
        client.emit('init', 1)
    }

    function handleKeydown(keyCode) {
        const roomName = clientRooms[client.id]

        if (!roomName) {
            return
        }

        try {
            keyCode = parseInt(keyCode)
        } catch (e) {
            console.error(e)
            return
        }

        const vel = getUpdatedVelocity(keyCode)

        if (vel) {
            state[roomName].players[client.number - 1].vel = vel
        }
    }
})

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {

        const winner = gameLoop(state[roomName])

        if (!winner) {
            emitGameState(roomName, state[roomName])
        } else {
            emitGameover(roomName, winner)
            state[roomName] = null
            clearInterval(intervalId)
        }

    }, 1000 / FRAME_RATE)
}


function emitGameState(roomName, state) {
    io.sockets.in(roomName).emit('gameState', JSON.stringify(state))
}

function emitGameover(roomName, winner) {
    io.sockets.in(roomName).emit('gameOver', JSON.stringify({ winner }))
}

http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});