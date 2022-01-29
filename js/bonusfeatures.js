'use strict'
var gManualMinesCount;

function safeClick(elBtn) {
    if (gIsFirstClick) return;
    if (gGame.safeCount === 1) {
        elBtn.disabled = 'true';
        elBtn.style.cursor = 'not-allowed';
    }
    var safeArray = checkCellsForSafeClick();
    var pos = getRandomIntInclusive(0, safeArray.length - 1)

    var cell = document.getElementById(`${safeArray[pos].i}-${safeArray[pos].j}`);

    cell.classList.add('safe-click');
    cell.classList.remove('td_regular');

    cell.innerText = gBoard[safeArray[pos].i][safeArray[pos].j].minesAroundCount;
    setTimeout(function () {
        cell.classList.remove('safe-click');
        cell.innerText = '';
    }, 500);
    gGame.safeCount--;
}

function checkCellsForSafeClick() {
    var array = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMarked && !gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                var location = { i: i, j: j };
                array.push(location);
            }
        }
    }
    return array;
}

function hintClick(elHint) {
    if (gIsFirstClick) return;
    if (!gGame.isHintOn) {
        gGame.isHintOn = true;
        console.log('hint element before', elHint);
        elHint.classList.remove('hint-off');
        elHint.classList.add('hint-on');
        console.log('hint element after', elHint);

        var elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "url('assets/images/lighton.jpg'), auto";
    } else {
        gGame.isHintOn = false;
        document.querySelectorAll('.hint').forEach(el => {
            elHint.classList.remove('hint-on');
        });
        var elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "default";
    }

}

function expandShownForHint(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= board[i].length) continue;

            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMine) {
                document.getElementById(`${i}-${j}`).classList.add('td_mine');
                document.getElementById(`${i}-${j}`).classList.add('hint-click');
                document.getElementById(`${i}-${j}`).classList.remove('td_flag');
            } else {
                document.getElementById(`${i}-${j}`).classList.add('hint-click');
                document.getElementById(`${i}-${j}`).classList.remove('td_flag');
                document.getElementById(`${i}-${j}`).innerText = board[i][j].minesAroundCount;
            }
        }
    }
    setTimeout(function () {
        document.querySelectorAll('.hint-click').forEach(el => {
            el.classList.remove('hint-click');
            el.classList.remove('td_mine');
            el.innerText = '';
            var pos = el.id.split('-');
            var posI = pos[0];
            var posJ = pos[1];
            if (gBoard[posI][posJ].isMarked) {
                el.classList.add('td_flag');
            }

        });

    }, 1000);
}

function manuallyPosMines(elBtn) {
        var elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "url('assets/images/2.jpg'), auto";
        gManualMinesCount = gLevel.MINES;
        gGame.isManualMinesMode = true;
}

