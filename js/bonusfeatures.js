'use strict'

function safeClick(elBtn) {
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
    elHint.src = 'assets/images/lighton.jpg';
    gGame.isHintOn = true;
    var elementToChange = document.getElementsByTagName("body")[0];
    elementToChange.style.cursor = "url('assets/images/lighton.jpg'), auto";

}

// function expandShownForHint(board, cellI, cellJ) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= board.length) continue;

//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {

//             if (j < 0 || j >= board[i].length) continue;

//             if (i === cellI && j === cellJ) continue;
//             if (gBoard[i][j].isMine) {
//                 document.getElementById(`${i}-${j}`).classList.add('td_mine');
//                 document.getElementById(`${i}-${j}`).style.backgroundColor = 'gray';

//             } else {
//                 document.getElementById(`${i}-${j}`).classList.add('td_regular');
//                 document.getElementById(`${i}-${j}`).innerText = board[i][j].minesAroundCount;
//                 var elSpan = document.querySelector('.shown');
//                 elSpan.innerText = gGame.shownCount;
//             }
//         }
//     }
// }