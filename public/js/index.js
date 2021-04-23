import {
    socket,
    handleInit,
    handleGameOver,
    handleGameState,
    handleGameCode,
    handleUnknownCode,
    handleTooManyPlayers,
    handleCountDown,
    newGame,
    joinGame,
    reset,
} from "./gamefunction.js";

import { select } from "./declarations.js";

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("unknownCode", handleUnknownCode);
socket.on("tooManyPlayers", handleTooManyPlayers);
socket.on("countdown", handleCountDown);
socket.on("gameCode", (code) => {
    handleGameCode(code);
});

select.newGameBtn.addEventListener("click", newGame);
select.joinGameBtn.addEventListener("click", () => {
    const input = select.gameCodeInput.value;
    joinGame(input);
});
select.home.addEventListener("click", reset);