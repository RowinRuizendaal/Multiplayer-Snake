const express = require('express')
const app = express()
const http = require('http').createServer(app)
const router = require('./routes/router')
const io = require('socket.io')(http)
const { initGame, gameLoop, getUpdatedVelocity } = require('./game')
const { FRAME_RATE } = require('./constants')



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

    function handleNewGame() {
        let roomName = makeid(5)
        clientRooms[client.id] = roomName
        client.emit('gamecode', roomName)

        state[roomName] = initGame()

        client.join(roomName)
        client.number = 1;
        client.emit('init', 1)
    }

    function handleKeydown(keyCode) {
        try {
            keyCode = parseInt(keyCode)
        } catch (e) {
            console.log(e)
            return
        }

        const vel = getUpdatedVelocity(keyCode)

        if (vel) {
            state.player.vel = vel
        }
    }

    startGameInterval(client, state)
})

function startGameInterval(client, state) {
    const intervalId = setInterval(() => {

        const winner = gameLoop(state)

        if (!winner) {
            client.emit('gameState', JSON.stringify(state))
        } else {
            client.emit('gameOver')
            clearInterval(intervalId)
        }

    }, 1000 / FRAME_RATE)
}


http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});