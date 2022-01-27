'use strict'

var gBoard;     	       // The main matrix 

var gLevel = {             // an object indicating the appearnce of the board
    SIZE: 4,               // that key represents the number of rows and columns
    MINES: 2,              // that key represents the number of mines on the board
    LIVES: 1               // that key represents the number of times the user can click on a mine before he loses
};

var gGame = {              // an object indicating the status of the game
    isOn: true,           // that key indicating if the game is on or not (false will prevent the player from making any changes)
    shownCount: 0,        // that key represents the number of cells revealed on the board
    markedCount: 0,       // that key represents the number of flagged cells
    secsPassed: 0         // that key represents the time passed (will start counting on the first cell click)
};                        // the info will be shown in spans in a modal (or maybe different places)
var gIsFirstClick = true;
var mineSound = new Audio('../assets/sounds/mine.mp3');
var gIntervalId = null;
var gMinutes = 0;
var gLives = gLevel.LIVES;

function init() {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gLives = gLevel.LIVES;
    gGame.secsPassed = 0;
    gMinutes = 0;
    var elSpan = document.querySelector('.timer');
    elSpan.innerText = gGame.secsPassed;
    clearInterval(gIntervalId);
    elSpan = document.querySelector('.mines-count');
    elSpan.innerText = gLevel.MINES;
    elSpan = document.querySelector('.lives');
    elSpan.innerText = gLevel.LIVES;
    elSpan = document.querySelector('.emoji');
    elSpan.innerText = '(❁´◡`❁)';
    gBoard = buildBoard();
    renderBoard(gBoard);
}


function buildBoard() {
    gIsFirstClick = true;
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    var cell = {}
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
        }
    }
    return board;
}


function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td onclick="cellClicked(this , ${i}, ${j})" oncontextmenu="cellMarked(this , ${i}, ${j})"
            id="${i}-${j}"></td>`
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function cellClicked(ellCell, cellI, cellJ) {
    if (!gGame.isOn || ellCell.classList.contains('td_mine') || ellCell.classList.contains('td_regular')
        || gBoard[cellI][cellJ].isMarked) return;

    gBoard[cellI][cellJ].isShown = true;
    gGame.shownCount++;

    if (gIsFirstClick) {
        firstClick();

        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
        ellCell.classList.add('td_regular');

        expandShown(gBoard, cellI, cellJ);
    } else if (gBoard[cellI][cellJ].isMine) {
        mineSound.play();
        ellCell.classList.add('td_mine');
        gLives--;
        var elSpan = document.querySelector('.lives');

        if (gLives === -1) elSpan.innerText = ':('
        else elSpan.innerText = gLives;

        gameOver();
    } else {
        ellCell.classList.add('td_regular');
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
        expandShown(gBoard, cellI, cellJ);

        gameOver();
    }
}

function firstClick() {
    startTimer();

    gIsFirstClick = false;
    addMines(gBoard);
    setMinesNegsCount(gBoard);
}

function startTimer() {
    gIntervalId = setInterval(function () {
        gGame.secsPassed++;
        var elSpan = document.querySelector('.timer');
        if (gGame.secsPassed > 60) {
            gMinutes++;
            gGame.secsPassed = 0;
        }
        elSpan.innerText = gMinutes + ':' + gGame.secsPassed;

    }, 1000);
}

function gameOver() {
    var elSpan = document.querySelector('.emoji');
    var msg = '';

    if (gLives === -1) {
        msg = 'You have lost! would you like to play again?';
        elSpan.innerText = '¯\_(ツ)_/¯';
        revealMinesLose();
    } else if (checkVictory()) {
        msg = 'You have won! The world is safer because of you! Would you like to play again?';
        elSpan.innerText = '༼ つ ◕_◕ ༽つ';
    } else {
        return;
    }

    setTimeout(function () {
        if (confirm(msg)) init();
        else gGame.isOn = false;
    }, 300);

    clearInterval(gIntervalId);
}

function checkVictory() {
    var shownMinesCount = 0;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown && gBoard[i][j].isMine) shownMinesCount++;
        }
    }

    return (gGame.shownCount + gGame.markedCount === gLevel.SIZE * gLevel.SIZE) && (shownMinesCount + gGame.markedCount === gLevel.MINES);
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                setMinesNegsCountForCell(i, j, board);
            }
        }
    }
}

function setMinesNegsCountForCell(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= board[i].length) continue;

            if (i === cellI && j === cellJ) continue;

            if (board[i][j].isMine) board[cellI][cellJ].minesAroundCount++;
        }
    }
}

function expandShown(board, cellI, cellJ) {
    if (board[cellI][cellJ].minesAroundCount !== 0) return;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= board[i].length) continue;

            if (i === cellI && j === cellJ) continue;

            if (!board[i][j].isMine && !board[i][j].isShown && !board[i][j].isMarked) {
                board[i][j].isShown = true;
                document.getElementById(`${i}-${j}`).classList.add('td_regular');
                document.getElementById(`${i}-${j}`).innerText = board[i][j].minesAroundCount;
                gGame.shownCount++;
                expandShown(board, i, j);
            }
        }
    }
}


function cellMarked(elCell, cellI, cellJ) {
    event.preventDefault();
    if (elCell.classList.contains('td_mine') || gBoard[cellI][cellJ].isShown) return;
    if (gIsFirstClick) {
        firstClick();
    }

    if (gBoard[cellI][cellJ].isMarked) {
        gBoard[cellI][cellJ].isMarked = false;
        gGame.markedCount--;
        elCell.classList.remove('td_flag');
    } else {
        elCell.classList.add('td_flag');
        gBoard[cellI][cellJ].isMarked = true;
        gGame.markedCount++;
    }
    var elSpan = document.querySelector('.flagged');
    elSpan.innerText = gGame.markedCount;

    gameOver();
}


function restart() {
    document.querySelector('.timer').innerText = '';
    gGame.secsPassed = 0;
    init();

}

function changeDifficulty(elBtn) {
    if (elBtn.classList.contains('easy')) {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        gLevel.LIVES = 1;

    } else if (elBtn.classList.contains('hard')) {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        gLevel.LIVES = 3;
    } else {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        gLevel.LIVES = 3;
    }
    init();
}


// TODO: to fix the timer to inlude 0 before the mintues digits
