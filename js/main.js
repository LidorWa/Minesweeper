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
var isFirstClick = true;
var gCellsCounter = 0;
var gIntervalId = null;
var gTimer = 0;


function init() {
    gGame.isOn = true;
    gTimer = 0;
    var elSpan = document.querySelector('.timer');
    elSpan.innerText = gTimer; 
    clearInterval(gIntervalId);
    elSpan = document.querySelector('.mines-count');
    elSpan.innerText = gLevel.MINES;
    elSpan = document.querySelector('.lives');
    elSpan.innerText = gLevel.LIVES;
    gBoard = buildBoard();
    renderBoard(gBoard);
}


function buildBoard() {
    isFirstClick = true;
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    var cell = {}
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
            gCellsCounter++;
        }
    }
    console.log('buildboard', board)
    return board;
}


function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td onclick="cellClicked(this , ${i}, ${j})" oncontextmenu="cellMarked(this , ${i}, ${j})"></td>`
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function cellClicked(ellCell, cellI, cellJ) {
    if (!gGame.isOn) return;
    gBoard[cellI][cellJ].isShown = true;

    if (isFirstClick) {
        gIntervalId = setInterval(function () {
            gTimer++;
            var elSpan = document.querySelector('.timer');
            elSpan.innerText = gTimer;  // TODO: the timer is working, to change it to 3 digits when it reaches 60
        }, 1000);
        isFirstClick = false;
        console.log('first click', gBoard);
        addMines(gBoard);
        setMinesNegsCount(gBoard);
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
        ellCell.classList.add('td_regular');
    } else if (gBoard[cellI][cellJ].isMine) {
        ellCell.classList.add('td_mine');

        gameOver();
    } else {
        ellCell.classList.add('td_regular');
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
    }
    gCellsCounter--;
}

function gameOver() {
    gGame.isOn = false;
    clearInterval(gIntervalId);
setTimeout(function(){
    if (confirm('You have lost! would you like to play again?')) init();
    else gGame.isOn = false;
}, 300);
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

function setMinesNegsCountForCell(cellI, cellJ, board) {                       // neighbours loop
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= board[i].length) continue;

            if (i === cellI && j === cellJ) continue;

            if (board[i][j].isMine) board[cellI][cellJ].minesAroundCount++;
        }
    }
}


function emptyCellsArray() {
    var array = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isShown) continue;
            array.push({ i: i, j: j });
        }
    }

    return array;
}

function addMines(board) {
    console.log('addMines before ', gBoard)
    var array = emptyCellsArray();
    for (var k = 0; k < gLevel.MINES; k++) {
        var idx = getRandomIntInclusive(0, array.length - 1)
        var pos = array[idx]
        board[pos.i][pos.j].isMine = true;
        array.splice(idx, 1);
    }
    console.log('addMines after ', gBoard)
}

function cellMarked(elCell, cellI, cellJ) {
    event.preventDefault();
    if (gBoard[cellI][cellJ].isMarked) {
        gBoard[cellI][cellJ].isMarked = false;
        elCell.classList.remove('td_flag');
    } else {
        elCell.classList.add('td_flag');
        gBoard[cellI][cellJ].isMarked = true;
    }
    // return false;
}

function expandShown(board, elCell, cellI, cellJ) {

}

function restart(elSpan) {
    document.querySelector('.timer').innerText = '';
    gTimer = 0;
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
