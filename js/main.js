'use strict'

var gBoard;     	           // The main matrix 

var gLevel = {             // an object indicating the appearnce of the board
    SIZE: 4,               // that key represents the number of rows and columns
    MINES: 2               // that key represents the number of mines on the board
};

var gGame = {              // an object indicating the status of the game
    isOn: true,           // that key indicating if the game is on or not (false will prevent the player from making any changes)
    shownCount: 0,        // that key represents the number of cells revealed on the board
    markedCount: 0,       // that key represents the number of flagged cells
    secsPassed: 0         // that key represents the time passed (will start counting on the first cell click)
};                        // the info will be shown in spans in a modal (or maybe different places)
var isFirstClick = true;


function init() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    // console.log('init', gBoard);
}


function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    var cell = {}
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
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
    // console.log('renderboard', gBoard);
}



function cellClicked(ellCell, cellI, cellJ) {
    gBoard[cellI][cellJ].isShown = true;

    if (isFirstClick) {
        isFirstClick = false;
        console.log('first click', gBoard);
        addMines(gBoard);
        setMinesNegsCount(gBoard);
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
        ellCell.classList.add('td_regular');
    } else if (gBoard[cellI][cellJ].isMine) {
        ellCell.classList.add('td_mine');

        // gameOver();
    } else {
        ellCell.classList.add('td_regular');
        // setMinesNegsCount(cellI,cellJ,gBoard)
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
    }
}

// function gameOver() {

// }


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
            // console.log(cellI, cellJ, board[cellI][cellJ]);
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
    // console.log('empty cells array',gBoard);
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

function cellMarked(elCell, cellI, cellJ){
    event.preventDefault();
    console.log(elCell);
    elCell.classList.add('td_flag');
    
    // window.addEventListener('contextmenu', function (e) { 
    //     elCell.
    //     e.preventDefault(); 
    //   }, false);
}

