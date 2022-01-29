'use strict'

var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
};

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    safeCount: 3,
    isHintOn: false,
    hintCount: 3,
    secsPassed: 0,
    isManualMinesMode: false,
    manualMinesCount: 2
};
var gIsFirstClick = true;
var mineSound = new Audio('assets/sounds/mine.mp3');
var gIntervalId = null;
var gMinutes = 0;
var gLives = gLevel.LIVES;
var gTimer;


// var gUndoArray = [{positions:[{}]}];
// var gUndoArray = [{positions:[{i:0,j:0}]}];
var gUndoArray = [];
// ({ positions: [{ i: cellI, j: cellJ }] })

function init() {
    onPageLoadLocalStorage();
    resetModelVarsDomForInit();
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function resetModelVarsDomForInit() {
    gGame.isOn = true;
    gGame.isManualMinesMode = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gLives = gLevel.LIVES;
    gGame.secsPassed = 0;
    gGame.safeCount = 3;
    var elBtn = document.querySelector('.safe-btn');
    elBtn.disabled = false;
    elBtn.style.cursor = 'pointer';
    gMinutes = 0;
    var elSpan = document.querySelector('.timer');
    elSpan.innerText = gGame.secsPassed;
    clearInterval(gIntervalId);
    document.querySelector('.hint1').src = 'assets/images/lightoff.jpg'
    document.querySelector('.hint2').src = 'assets/images/lightoff.jpg'
    document.querySelector('.hint3').src = 'assets/images/lightoff.jpg'
    var elementToChange = document.getElementsByTagName('body')[0];
    elementToChange.style.cursor = 'default';
    document.querySelectorAll('.hint').forEach(el => {
        el.style.display = 'inline-block';
        el.classList.remove('hint-on');
    });
    elSpan = document.querySelector('.mines-count');
    elSpan.innerText = gLevel.MINES;
    elSpan = document.querySelector('.lives');
    elSpan.innerText = gLevel.LIVES;
    elSpan = document.querySelector('.shown');
    elSpan.innerText = gGame.shownCount;
    elSpan = document.querySelector('.emoji');
    elSpan.innerText = '(❁´◡`❁)';
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

function saveAction(positions) {
    gUndoArray.push({ positions });
    console.log('gUndoArray from saveAction', gUndoArray)

}

function undoAction() {
    if (!gGame.isOn) return;
    var posIndex;
    var posIndex2;
    var reversePos = gUndoArray.pop();
    console.log('reversePos', reversePos)
    for (var k = 0; k < reversePos.positions.length; k++) {
        posIndex = reversePos.positions[k].i;
        console.log('posIndex', posIndex)
        posIndex2 = reversePos.positions[k].j;
        console.log('posIndex2', posIndex2)
        if (gBoard[posIndex][posIndex2].isMine) {
            gBoard[posIndex][posIndex2].isShown = false;
            gLives++;
            var elLives = document.querySelector('.lives');
            elLives.innerText = gLives;
            var cellMine = document.getElementById(`${posIndex}-${posIndex2}`);
            cellMine.classList.remove('td_mine');
            cellMine.style.backgroundColor = 'gray';
            cellMine.innerText = '';
        } else {
            gBoard[posIndex][posIndex2].isShown = false;
            var cellRegular = document.getElementById(`${posIndex}-${posIndex2}`);
            cellRegular.classList.remove('td_regular');
            cellRegular.style.backgroundColor = 'gray';
            cellRegular.innerText = '';
        }
        gGame.shownCount--;
        var spanShown = document.querySelector('.shown');
        spanShown.innerText = gGame.shownCount;
    }

}
function cellClicked(ellCell, cellI, cellJ) {
    if (!gGame.isOn || ellCell.classList.contains('td_mine') || ellCell.classList.contains('td_regular')
        || (gBoard[cellI][cellJ].isMarked && !gGame.isHintOn)) return;

    if (gGame.isManualMinesMode) {
        handleManualMines(cellI, cellJ);
        return;
    }

    if (gGame.isHintOn) {
        handleCellClickedHint(cellI, cellJ);
        return;
    }
    gBoard[cellI][cellJ].isShown = true;
    gGame.shownCount++;
    var elSpan = document.querySelector('.shown');
    elSpan.innerText = gGame.shownCount;
    if (gIsFirstClick) {
        firstClick();
        gTimer = Date.now();

        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;
        ellCell.classList.add('td_regular');

        var positions = [{ i: cellI, j: cellJ }];
        expandShown(gBoard, cellI, cellJ, positions);
        saveAction(positions);
    } else if (gBoard[cellI][cellJ].isMine) {
        mineSound.play();
        ellCell.classList.add('td_mine');
        gLives--;
        var elSpan = document.querySelector('.lives');

        if (gLives === -1) elSpan.innerText = ':('
        else elSpan.innerText = gLives;

        gameOver();
        saveAction([{ i: cellI, j: cellJ }])
    } else {
        ellCell.classList.add('td_regular');
        ellCell.innerText = gBoard[cellI][cellJ].minesAroundCount;

        var positions = [{ i: cellI, j: cellJ }];

        var positions = [{ i: cellI, j: cellJ }];
        expandShown(gBoard, cellI, cellJ, positions);
        saveAction(positions);

        gameOver();
    }
    // saveAction(cellI, cellJ);
}


function handleCellClickedHint(cellI, cellJ) {
    if (!gGame.isOn) return;
    expandShownForHint(gBoard, cellI, cellJ)
    document.getElementsByTagName("body")[0].style.cursor = 'default';
    gGame.isHintOn = false;
    document.querySelectorAll('.hint-on').forEach(el => {
        el.style.display = 'none';
    });
}


function handleManualMines(cellI, cellJ) {
    if (gGame.manualMinesCount > 0) {
        gBoard[cellI][cellJ].isMine = true;
        document.getElementById(`${cellI}-${cellJ}`).classList.add('td_mine');
        gGame.manualMinesCount--;

        if (gGame.manualMinesCount === 0) {
            setTimeout(() => {
                document.querySelectorAll('.td_mine').forEach(el => {
                    el.classList.remove('td_mine');
                    var elementToChange = document.getElementsByTagName('body')[0];
                    elementToChange.style.cursor = 'default';
                    gGame.isManualMinesMode = false;
                })
            }, 200);
        }
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
        if (gGame.secsPassed >= 10) elSpan.innerText = '0' + gMinutes + ':' + gGame.secsPassed;
        else elSpan.innerText = '0' + gMinutes + ':' + '0' + gGame.secsPassed;
        if (gMinutes >= 10) elSpan.innerText = gMinutes + ':' + '0' + gGame.secsPassed;



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
        gTimer = ((Date.now() - gTimer) / 1000);
        handleTime(gTimer);
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

function expandShown(board, cellI, cellJ, positions) {
    if (board[cellI][cellJ].minesAroundCount === 0) {
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

                    positions.push({ i, j });
                    expandShown(board, i, j, positions);

                    var elSpan = document.querySelector('.shown');
                    elSpan.innerText = gGame.shownCount;

                }
            }
        }
    }

    // saveAction(positions);
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
        gGame.manualMinesCount = 12;
    } else {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        gLevel.LIVES = 3;
        gGame.manualMinesCount = 30;
    }
    init();
}

