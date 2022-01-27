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
    for (var k = 0; k < gLevel.MINES; k++) {
        var idx = getRandomIntInclusive(0, array.length - 1)
        var pos = array[idx]
        board[pos.i][pos.j].isMine = true;
        array.splice(idx, 1);
    }
}


function revealMinesLose(){
    for(var i=0; i<gBoard.length;i++){
        for (var j=0; j<gBoard[0].length;j++){
            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMine){
                var elMine = document.getElementById(`${i}-${j}`);
                elMine.classList.add('td_mine');
                elMine.style.backgroundColor= 'gray';

            }
        }
    }
}