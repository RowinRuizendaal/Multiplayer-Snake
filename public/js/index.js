import { config } from './config.js'



const BG_COLOUR = config.BG_COLOUR
const SNAKE_COLOUR = config.SNAKE_COLOUR
const OPPONENT_COLOUR = config.OPPONENT_COLOUR
const FOOD_COLOUR = config.FOOD_COLOUR


const socket = io(window.location.host)

socket.on('init', handleInit)
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)
socket.on('gameCode', handleGameCode)
socket.on('unknownCode', handleUnknownCode)
socket.on('tooManyPlayers', handleTooManyPlayers)

const gameScreen = document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const newGameBtn = document.getElementById('newGameButton')
const joinGameBtn = document.getElementById('joinGameButton')
const gameCodeInput = document.getElementById('gameCodeInput')
const gameCodeDisplay = document.getElementById('gameCodeDisplay')
const copyCode = document.getElementById('Copy')


let getcode;



function newGame() {
    socket.emit('newGame')
    init()
}

function joinGame() {
    const code = gameCodeInput.value
    socket.emit('joinGame', code)
    init()
}

let canvas, ctx
let playerNumber
let gameActive = false

function init() {
    initialScreen.style.display = 'none'
    gameScreen.style.display = 'block'
    gameCodeDisplay.style.display = 'block'


    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    canvas.width = canvas.height = 600

    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', keydown)
    gameActive = true
}

function keydown(e, state) {
    // console.log(state)
    socket.emit('keydown', e.keyCode)
}

function paintGame(state) {
    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const food = state.food
    const gridsize = state.gridsize
    const size = canvas.width / gridsize

    ctx.fillStyle = FOOD_COLOUR
    ctx.fillRect(food.x * size, food.y * size, size, size)


    paintPlayer(state.players[0], size, SNAKE_COLOUR)
    paintPlayer(state.players[1], size, OPPONENT_COLOUR)
}

function paintPlayer(playerState, size, colour) {
    const snake = playerState.snake

    ctx.fillStyle = colour
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size)
    }
}

function handleInit(number) {
    playerNumber = number
}

function handleGameState(gameState) {
    if (!gameActive) {
        return
    }
    gameState = JSON.parse(gameState)
    requestAnimationFrame(() => paintGame(gameState))
}

function handleGameOver(data) {
    if (!gameActive) {
        return
    }
    data = JSON.parse(data)

    gameActive = false

    if (data.winner === playerNumber) {
        alert('You Win!')
    } else {
        alert('You lost')
    }
}

function handleGameCode(gameCode) {
    gameCodeDisplay.textContent = `Your gamecode is: ${gameCode}`
    getcode = gameCode
}

function handleUnknownCode() {
    reset()
    alert('Unknown Game Code')
}

function handleTooManyPlayers() {
    reset()
    alert('This game is already in progress')
}

function reset() {
    playerNumber = null
    gameCodeInput.value = ''
    initialScreen.style.display = "block"
    gameScreen.style.display = "none"
}


// https://stackoverflow.com/questions/50795042/create-a-copy-button-without-an-input-text-box/50795833
function Clipboard_CopyTo(value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)
copyCode.addEventListener('click', () => {
    Clipboard_CopyTo(`${window.location.host}/?${getcode}`);
})

window.onload = () => {
    let url = window.location.href;
    if (url.includes('?')) {
        const split = url.split(`?`)[1]
        gameCodeInput.value = split
    }
}