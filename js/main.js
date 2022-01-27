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
var isVictory = false;

function init() {
    gGame.isOn = true;
    isVictory = false;
    gGame.shownCount = 0;
    gGame.markedCount=0;
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
    if (!gGame.isOn || ellCell.classList.contains('td_mine') ||ellCell.classList.contains('td_regular')) return;
    gBoard[cellI][cellJ].isShown = true;
    gGame.shownCount++;
    var elSpan = '';
    isVictory= checkVictory()
    if (gIsFirstClick) {
        gIntervalId = setInterval(function () {
            gGame.secsPassed++;
            elSpan = document.querySelector('.timer');
            if (gGame.secsPassed> 60){
                gMinutes++;
                gGame.secsPassed = 0;
            }
            elSpan.innerText = gMinutes + ':'+ gGame.secsPassed;
            
        }, 1000);
        gIsFirstClick = false;
        addMines(gBoard);
        setMinesNegsCount(gBoard);
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
        ellCell.classList.add('td_regular');
        console.log('shownCount first',gGame.shownCount)
    } else if (gBoard[cellI][cellJ].isMine) {
        mineSound.play();
        ellCell.classList.add('td_mine');
        gLives--;
        elSpan = document.querySelector('.lives');
        elSpan.innerText = gLives;
        console.log('shownCount mine',gGame.shownCount)
        if (gLives === -1) {
            isVictory = false;
            gameOver(isVictory);
        }
    } else {
        ellCell.classList.add('td_regular');
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
        console.log('shownCount regular',gGame.shownCount)
    }
}

function gameOver(isVictory) {
    clearInterval(gIntervalId);
    var elSpan = document.querySelector('.emoji');
    var msg = '';
    if (isVictory) {
        msg = 'You have won! The world is safer because of you! Would you like to play again?';
        elSpan.innerText = '༼ つ ◕_◕ ༽つ';
    }
    else msg = 'You have lost! would you like to play again?';
    elSpan.innerText = '¯\_(ツ)_/¯';
    revealMinesLose();
    setTimeout(function () {
        if (confirm(msg)) init();
        else gGame.isOn = false;
    }, 300);
}

function checkVictory(){
    var shownCounter = 0;
    var minesFlaggedCounter = 0;
    for (var i= 0; i< gBoard.length;i++){
        for (var j= 0; j< gBoard[0].length;j++){
            if (gBoard[i][j].isShown) shownCounter++;
            if ((gBoard[i][j].isMarked && gBoard[i][j].isMine) || 
            (gBoard[i][j].isMine && gBoard[i][j].isShown)) minesFlaggedCounter++;
                
        }
    }
    // if (shownCounter=== gGame.shownCount && minesFlaggedCounter===gLevel.MINES) return true;
    if (shownCounter=== (gLevel.SIZE*gLevel.SIZE) && minesFlaggedCounter===gLevel.MINES) return true;
    else return false;
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
    // if (!board[cellI][cellJ].minesAroundCount) {
    //     expandShown(gBoard,)
    // }
}
function expandShown(board, elCell, cellI, cellJ) {

}


function cellMarked(elCell, cellI, cellJ) {
    event.preventDefault();
    if (gIsFirstClick || elCell.classList.contains('td_mine')) return;
    if (gBoard[cellI][cellJ].isMarked) {
        gBoard[cellI][cellJ].isMarked = false;
        elCell.classList.remove('td_flag');
    } else {
        elCell.classList.add('td_flag');
        gBoard[cellI][cellJ].isMarked = true;
        gGame.markedCount++;
    }
    var elSpan = document.querySelector('.flagged');
    elSpan.innerText = gGame.markedCount;
    gGame.shownCount++;
    console.log('shownCount cellmarked',gGame.shownCount)
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



// TODO: add a class / id to every cell with the I and J indexes (could be helpfull in the expandShown and revealMinesLose functions)
// TODO: add expand/ full expand in conjunction with expandShown
// TODO: update the gGame.shownCount and use it for victory
// TODO: ● Show a timer that starts on first click (//right\\ / left) and stops when game is over.