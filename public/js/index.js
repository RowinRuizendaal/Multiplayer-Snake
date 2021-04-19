import { config } from "./config.js";

const BG_COLOUR = config.BG_COLOUR;
const SNAKE_COLOUR = config.SNAKE_COLOUR;
const OPPONENT_COLOUR = config.OPPONENT_COLOUR;
const FOOD_COLOUR = config.FOOD_COLOUR;

const socket = io(window.location.host);

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownCode", handleUnknownCode);
socket.on("tooManyPlayers", handleTooManyPlayers);
socket.on("countdown", handleCountDown);

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const copyCode = document.getElementById("Copy");
const countdown = document.getElementById("countdown");
const overlay = document.getElementById("overlay");

const audio = new Audio("./sound/game-music.mp3");

let canvas, ctx;
let playerNumber;
let gameActive = false;
let getcode;
let previousButton;

function newGame() {
    socket.emit("newGame");
    init();
}

function joinGame(code) {
    socket.emit("joinGame", code);
    init();
}

function init() {
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
    gameCodeDisplay.style.display = "block";

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener("keydown", keydown);
    gameActive = true;
}

function keydown(e) {
    // use Math.abs return a value of 2 from the keycodes (absolute)
    if (Math.abs(previousButton - e.keyCode) === 2) {
        return;
    }

    previousButton = e.keyCode;

    socket.emit("keydown", e.keyCode);
}

function paintGame(state) {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width / gridsize;

    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, SNAKE_COLOUR);
    paintPlayer(state.players[1], size, OPPONENT_COLOUR);
}

function paintPlayer(playerState, size, colour) {
    const snake = playerState.snake;

    ctx.fillStyle = colour;
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}

function handleInit(number) {
    playerNumber = number;
}

function handleGameState(gameState) {
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
    if (!gameActive) {
        return;
    }
    data = JSON.parse(data);

    gameActive = false;
    audio.pause();
    overlay.style.display = "flex";

    if (data.winner === playerNumber) {
        overlay.textContent = "You won the game";
    } else {
        overlay.textContent = "You lost the game";
    }
}

function handleGameCode(gameCode) {
    gameCodeDisplay.textContent = `Your gamecode is: ${gameCode}`;
    getcode = gameCode;
}

function handleUnknownCode() {
    reset();
    alert("Unknown Game Code");
}

function handleTooManyPlayers() {
    reset();
    alert("This game is already in progress");
}

function handleCountDown(timer) {
    audio.play();
    audio.volume = 0.1;

    if (timer < 6) {
        countdown.style.color = "#f63f63";
    }

    countdown.textContent = timer;

    if (timer === 0) {
        countdown.textContent = "The game has begun!";
        countdown.style.color = "white";
    }
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = "";
    initialScreen.style.display = "block";
    gameScreen.style.display = "none";
}

// https://stackoverflow.com/questions/50795042/create-a-copy-button-without-an-input-text-box/50795833
function Clipboard_CopyTo(value) {
    const tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);
copyCode.addEventListener("click", () => {
    Clipboard_CopyTo(
        `${window.location.protocol}//${window.location.host}/?${getcode}`
    );
});

window.onload = () => {
    const url = window.location.href;
    if (url.includes("?")) {
        const gameCodeInput = url.split(`?`)[1];
        joinGame(gameCodeInput);
    }
};