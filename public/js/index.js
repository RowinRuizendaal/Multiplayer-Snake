// Config might store this in a seperate file
const BG_COLOUR = '#231f20'
const SNAKE_COLOUR = '#c2c2c2'
const FOOD_COLOUR = '#e66916'


const socket = io('http://localhost:3000')

socket.on('init', handleInit)
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)

const gameScreen = document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const newGameBtn = document.getElementById('newgameButton')
const joinGameBtn = document.getElementById('joinGameBtn')
const gamecodeInput = document.getElementById('gameCodeInput')

newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)

function newGame() {
    socket.emit('newGame')
    init()
}

function joinGame() {
    const code = gameCodeInput.value
    socket.emit('joinGame', code)
    init()
}


let canvas, ctx;


const gameState = {
    player: {
        pos: {
            x: 3,
            y: 10
        },
        vel: {
            x: 1,
            y: 0,
        },
        snake: [
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
        ],
    },
    food: {
        x: 7,
        y: 7,
    },
    gridsize: 20,
}

// setup canvas 
function init() {

    initialScreen.style.display = 'none'
    gameScreen.style.display = 'block'

    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    canvas.width = canvas.height = 600

    ctx.fillstyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', keydown)
}

function keydown(e) {
    socket.emit('keydown', e.keyCode)
}



function paintGame(state) {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize
    const size = canvas.width / gridsize



    ctx.fillStyle = FOOD_COLOUR

    // convert to pixels
    ctx.fillRect(food.x * size, food.y * size, size, size)

    paintPlayer(state.player, size, SNAKE_COLOUR)
}

function paintPlayer(playerState, size, colour) {
    const snake = playerState.snake

    ctx.fillStyle = colour
    console.log(colour)

    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, cell.x * size, size);
    }
}

paintGame(gameState)


function handleInit(msg) {
    console.log(msg)
}

function handleGameState(gamestate) {
    gamestate = JSON.parse(gamestate)
    requestAnimationFrame(() => paintGame(gamestate))
}

function handleGameOver() {
    alert('You lost')
}