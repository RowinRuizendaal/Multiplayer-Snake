import { select } from "./declarations.js";
import { config } from "./config.js";

// Config for the game
const BG_COLOUR = config.BG_COLOUR;
const SNAKE_COLOUR = config.SNAKE_COLOUR;
const OPPONENT_COLOUR = config.OPPONENT_COLOUR;
const FOOD_COLOUR = config.FOOD_COLOUR;

let canvas;
let ctx;
let playerNumber;
let gameActive = false;
let getcode;
let previousButton;

// Audio
const audio = new Audio("./sound/game-music.mp3");

export const socket = io(window.location.host);

export function newGame() {
    socket.emit("newGame");
    init();
}

export function joinGame(code) {
    console.log(code);
    socket.emit("joinGame", code);
    init();
}

export function init() {
    select.initialScreen.style.display = "none";
    select.gameScreen.style.display = "block";
    select.gameCodeDisplay.style.display = "block";

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener("keydown", keydown);
    gameActive = true;
}

export function keydown(e) {
    // use Math.abs return a value of 2 from the keycodes (absolute)
    if (Math.abs(previousButton - e.keyCode) === 2) {
        return;
    }

    previousButton = e.keyCode;

    socket.emit("keydown", e.keyCode);
}

export function paintGame(state) {
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

export function paintPlayer(playerState, size, colour) {
    const snake = playerState.snake;

    ctx.fillStyle = colour;
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}

export function handleInit(number) {
    playerNumber = number;
}

export function handleGameState(gameState) {
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}

export function handleGameOver(data) {
    if (!gameActive) {
        return;
    }
    data = JSON.parse(data);

    gameActive = false;
    audio.pause();
    overlay.style.display = "flex";

    if (data.winner === playerNumber) {
        select.overlayHeader.textContent = "You won the game";

        // Fetch to server, for using session storage for updating values
        fetch(`${window.location.protocol}//${window.location.host}/endgame`, {
            method: "POST",
            body: {
                data: "",
            },
        });
    } else {
        select.overlayHeader.textContent = "You lost the game";
    }
}

export function handleGameCode(gameCode) {
    select.gameCodeDisplay.textContent = `Your gamecode is: ${gameCode}`;
    getcode = gameCode;
}

export function handleUnknownCode() {
    reset();
    select.error.textContent = "We are unable to find that game";
}

export function handleTooManyPlayers() {
    reset();
    alert("This game is already in progress");
}

export function handleCountDown(timer) {
    audio.play();
    audio.volume = 0.1;

    if (timer < 6) {
        select.countdown.style.color = "#f63f63";
    }

    select.countdown.textContent = timer;

    if (timer === 0) {
        select.countdown.textContent = "The game has begun!";
        select.countdown.style.color = "white";
    }
}

export function reset() {
    select.playerNumber = null;
    select.gameCodeInput.value = "";
    select.initialScreen.style.display = "block";
    select.gameScreen.style.display = "none";
    select.overlay.style.display = "none";
    select.countdown.textContent = "";
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

select.copyCode.addEventListener("click", () => {
    Clipboard_CopyTo(`${getcode}`);
});