

let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;


let bombProbability = 3;
let maxProbability = 15;

let gameOver = false; 
let totalBombs = 0; 
let flagsRemaining = 0;

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}





function minesweeperGameBootstrapper(rowCount, colCount) {
    let easy = {
        'rowCount': 9,
        'colCount': 9,
    };

    let medium = {
        'rowCount': 16,
        'colCount': 16
    };
    let hard = {
        'rowCount': 24,
        'colCount': 24
    };

    if (rowCount == null && colCount == null) {
        generateBoard(easy);
    } else {
        generateBoard({'rowCount': rowCount, 'colCount': colCount});
    }
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;

    for (let i = 0; i < boardMetadata.colCount; i++) {
        board[i] = new Array(boardMetadata.rowCount);
    }

    totalBombs = 0; 
    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            const hasBomb = Math.random() * maxProbability < bombProbability;
            board[i][j] = new BoardSquare(hasBomb, 0);

            if (hasBomb) {
                totalBombs++;  
            }
        }
    }

    flagsRemaining = totalBombs;
    updateFlagsRemaining();  

    countBombsAround();

    openedSquares = [];
    flaggedSquares = [];
    renderBoard(boardMetadata.rowCount, boardMetadata.colCount);

    console.log(board);
}


function countBombsAround() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (!board[i][j].hasBomb) {
                board[i][j].bombsAround = countNearbyBombs(i, j);
            }
        }
    }
}

function countNearbyBombs(x, y) {
    let bombCount = 0;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    directions.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[0].length) {
            if (board[nx][ny].hasBomb) bombCount++;
        }
    });
    return bombCount;
}

function revealAllBombs() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].hasBomb) {
                const square = document.querySelectorAll('.square')[i * board[0].length + j];
                square.style.backgroundColor = 'black';
                square.style.color = 'red';  
            }
        }
    }
}


function openSquare(x, y) {
    if (gameOver) return;  

    const square = document.querySelectorAll('.square')[x * board[0].length + y];

    if (board[x][y].hasBomb) {
        revealAllBombs();

        gameOver = true;

        setTimeout(() => {
            alert("Boom! You hit a bomb.");
            showRestartButton();  
        }, 100); 

    } else {
        if (board[x][y].bombsAround === 0) {
            square.style.backgroundColor = 'white';
        } else {
            square.textContent = board[x][y].bombsAround;
        }

        square.classList.add('opened');
        openedSquares.push([x, y]);

    }
}


function renderBoard(rowCount, colCount) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${colCount}, 30px)`;

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.addEventListener('click', () => openSquare(i, j));

            square.addEventListener('contextmenu', (event) => {
                event.preventDefault();   
                toggleFlag(square, i, j);
            });

            gameBoard.appendChild(square);
        }
    }
}

function showRestartButton() {
    const buttonsContainer = document.getElementById('buttonsContainer');

    if (!document.getElementById('restartButton')) {
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.id = 'restartButton';
        buttonsContainer.appendChild(restartButton);  

        restartButton.addEventListener('click', restartGame);
    }
}

function updateFlagsRemaining() {
    const flagsDisplay = document.getElementById('flagsRemaining');
    flagsDisplay.textContent = flagsRemaining;
}

function toggleFlag(square, x, y) {
    if (square.classList.contains('flagged')) {
        square.classList.remove('flagged');
        flaggedSquares = flaggedSquares.filter(flag => !(flag[0] === x && flag[1] === y));
        flagsRemaining++;  
    } else if (flagsRemaining > 0) {
        square.classList.add('flagged');
        flaggedSquares.push([x, y]);
        flagsRemaining--;  
    }
    updateFlagsRemaining();  
}

function restartGame() {
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.remove();
    }

    gameOver = false;
    board = [];
    openedSquares = [];
    flaggedSquares = [];
    bombCount = 0;
    squaresLeft = 0;

    let difficulty = document.getElementById("difficulty").value;
    bombProbability = parseInt(document.getElementById("bombProb").value);
    maxProbability = parseInt(document.getElementById("maxProb").value);

    let rowCount, colCount;
    switch (difficulty) {
        case "medium":
            rowCount = 16;
            colCount = 16;
            break;
        case "hard":
            rowCount = 24;
            colCount = 24;
            break;
        default:
            rowCount = 9;
            colCount = 9;
            break;
    }

    minesweeperGameBootstrapper(rowCount, colCount);
}

document.getElementById("startGame").addEventListener("click", () => {
    let difficulty = document.getElementById("difficulty").value;
    bombProbability = parseInt(document.getElementById("bombProb").value);
    maxProbability = parseInt(document.getElementById("maxProb").value);

    let rowCount, colCount;
    switch (difficulty) {
        case "medium":
            rowCount = 16;
            colCount = 16;
            break;
        case "hard":
            rowCount = 24;
            colCount = 24;
            break;
        default:
            rowCount = 9;
            colCount = 9;
            break;
    }

    minesweeperGameBootstrapper(rowCount, colCount);
});


