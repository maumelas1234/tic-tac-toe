document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const messageDisplay = document.getElementById('message');
    const modal = document.getElementById('message-modal');
    const closeModal = document.getElementById('close-modal');
    const modalReset = document.getElementById('modal-reset');
    const singlePlayerButton = document.getElementById('single-player');
    const twoPlayerButton = document.getElementById('two-player');
    let currentPlayer = 'X';
    let gameActive = false; // Game starts inactive
    let boardState = Array(9).fill(null);
    let singlePlayerMode = false;
    let waitingForMove = false; // Flag to track if waiting for move

    singlePlayerButton.addEventListener('click', () => startGame(true));
    twoPlayerButton.addEventListener('click', () => startGame(false));
    modalReset.addEventListener('click', resetGame);
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    closeModal.addEventListener('click', closeModalMessage);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalMessage();
        }
    });

    function startGame(isSinglePlayer) {
        singlePlayerMode = isSinglePlayer;
        document.getElementById('mode-selection').style.display = 'none';
        board.style.display = 'grid';
        gameActive = true; // Activate the game
        messageDisplay.textContent = '';
        currentPlayer = 'X'; // Ensure game starts with player 'X'
        resetBoard();
    }

    function handleCellClick(e) {
        if (!gameActive || waitingForMove) return; // Check if game is active and not waiting for move
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));

        if (boardState[cellIndex] !== null) return; // Check if cell is already occupied

        makeMove(cell, cellIndex, currentPlayer);

        if (checkWin(currentPlayer)) {
            gameActive = false;
            showMessage(`${currentPlayer} Wins!`);
            return;
        }

        if (boardState.every(cell => cell !== null)) {
            gameActive = false;
            showMessage(`It's a Draw!`);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player

        if (singlePlayerMode && currentPlayer === 'O') {
            waitingForMove = true; // Prevent player from clicking during computer move
            setTimeout(computerMove, 500);
        }
    }

    function makeMove(cell, cellIndex, player) {
        boardState[cellIndex] = player;
        cell.textContent = player;
        waitingForMove = false; // Allow next move after current move
    }

    function computerMove() {
        const bestMove = getBestMove();
        const cell = cells[bestMove.index];
        makeMove(cell, bestMove.index, currentPlayer);

        if (checkWin(currentPlayer)) {
            gameActive = false;
            showMessage(`${currentPlayer} Wins!`);
            return;
        }

        if (boardState.every(cell => cell !== null)) {
            gameActive = false;
            showMessage(`It's a Draw!`);
            return;
        }

        currentPlayer = 'X'; // Switch back to player after computer move
    }

    function getBestMove() {
        const bestMove = minimax(boardState, 'O');
        return bestMove;
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.reduce((acc, curr, index) => curr === null ? acc.concat(index) : acc, []);

        if (checkWin('X')) {
            return { score: -10 };
        } else if (checkWin('O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        }

        return bestMove;
    }

    function checkWin(player) {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winConditions.some(combination => {
            return combination.every(index => boardState[index] === player);
        });
    }

    function resetBoard() {
        boardState = Array(9).fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('win');
        });
        waitingForMove = false; // Reset move flag
    }

    function resetGame() {
        gameActive = false;
        messageDisplay.textContent = '';
        modal.style.display = 'none';
        document.getElementById('mode-selection').style.display = 'block';
        resetBoard();
    }

    function showMessage(message) {
        messageDisplay.textContent = message;
        modal.style.display = 'block';
    }

    function closeModalMessage() {
        modal.style.display = 'none';
    }
});
