'use strict'

var gBoard;     	           // The main matrix 

// var cell = {                // an object that will occupy each cell of the matrix, contains:
//     minesAroundCount: 0,    // how many mines in the neighbouring cells
//     isShown: false,          // is the cell shown or concealed
//     isMine: false,          // is the cell contains a mine or not
//     isMarked: false         // is the cell marked by flag or not
// };

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

const gMINE = '<img src="../assets/images/2.jpg" class="mine"/>';

var isFirstClick = true;


function init() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}


function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    var cell = { minesAroundCount: 0, isShown: true, isMine: false, isMarked: false };
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = cell;
        }
    }

    return board;
}


function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = (cell.isMine) ? 'mine' : 'regular';
            strHTML += `<td class="${className}"
            onclick="cellClicked(this , ${i}, ${j})"></td>`
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function cellClicked(ellCell, cellI, cellJ) {
    if (isFirstClick) {
        isFirstClick = false;
        ellCell.isShown = true;
        addMines(gBoard);
    } else {
        if (ellCell.isMine) {
            ellCell.classList.add('td_background');
        }
    }
}



function setMinesNegsCount(cellI, cellJ, board) {                       // neighbours loop
    // if (board[cellI][cellJ].isMine === true) // To add a gameover function 
    var minesCounter = 0;
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
    var array = emptyCellsArray();
    var idx = getRandomIntInclusive(0, array.length - 1)
    var pos = array[idx]
    board[pos.i][pos.j].isMine = true;
    // renderCell(pos, MINE);
}



