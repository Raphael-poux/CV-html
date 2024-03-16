const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const reset = document.getElementById('reset');
const playerX = document.getElementById('playerX');
const playerO = document.getElementById('playerO');
let pointsPlayerX = 0;
let pointsPlayerO = 0;
let firstPlayer = 'X'
let currentPlayer = 'X';
let gameActive = true;
cells.forEach(function(cell) {
    cell.classList.add('changement-couleur');
});

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (cells[a].textContent === currentPlayer &&
            cells[b].textContent === currentPlayer &&
            cells[c].textContent === currentPlayer) {
            cells[a].style.backgroundColor = 'rgba(101, 67, 35, 0.5)';
            cells[b].style.backgroundColor = 'rgba(101, 67, 35, 0.5)';
            cells[c].style.backgroundColor = 'rgba(101, 67, 35, 0.5)';
            return true;
        }
    }
    return false;
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');
    if (cell.textContent === '' && gameActive) {
        cell.textContent = currentPlayer;
        if (checkWinner()) {
            alert(`Player ${currentPlayer} wins!`);
            if (currentPlayer == 'X') {
                pointsPlayerX += 2
            } else {
                pointsPlayerO += 2
            }
            updateGameActiveStatus(false);
        } else if ([...cells].every(cell => cell.textContent !== '')) {
            alert("It's a draw!");
            pointsPlayerX += 1
            pointsPlayerO += 1
            updateGameActiveStatus(false);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}


function handleReset(e) {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '';
    });
    if (gameActive == false) {
        firstPlayer = firstPlayer === 'X' ? 'O' : 'X';
    }
    currentPlayer = firstPlayer
    updateGameActiveStatus(true);
}

function updateGameActiveStatus(status) {
    gameActive = status
    reset.textContent = gameActive ? 'Reset' : 'New Game';
    playerO.textContent = `Second Player Points : ${pointsPlayerO}`
    playerX.textContent = `First Player Points : ${pointsPlayerX}`
}   

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
reset.addEventListener('click', handleReset);
