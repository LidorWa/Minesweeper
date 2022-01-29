'use strict'
var gScore1 = 0;
var gScore2 = 0;
var gScore3 = 0;


function onPageLoadLocalStorage() {
    var playerName = 'Lidor';
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('Level1', gScore1);
    localStorage.setItem('Level2', gScore2);
    localStorage.setItem('Level3', gScore3);
    document.querySelector('.score1').innerText = gScore1;
    document.querySelector('.score2').innerText = gScore2;
    document.querySelector('.score3').innerText = gScore3;


}

function handleTime(timer) {
    var bestTimeFromStorage;
    var score;
    if (gLevel.SIZE === 4) {
        bestTimeFromStorage = localStorage.getItem('Level1');
        if (bestTimeFromStorage === '0'){
            localStorage.setItem('Level1',timer);
            gScore1 = timer;
            score = document.querySelector('.score1');
            score.innerText = timer;
        } 
        else if (bestTimeFromStorage > timer) {
            localStorage.setItem('Level1', timer)
            gScore1 = timer;
            score = document.querySelector('.score1');
            score.innerText = timer;
        }

    } else if (gLevel.SIZE === 8) {
        bestTimeFromStorage = localStorage.getItem('Level2');
        if (bestTimeFromStorage === '0'){
            localStorage.setItem('Level2',timer);
            gScore2 = timer;
            score = document.querySelector('.score2');
            score.innerText = timer;
        } 
        else if (bestTimeFromStorage > timer) {
            localStorage.setItem('Level2', timer)
            gScore2 = timer;
            score = document.querySelector('.score2');
            score.innerText = timer;
        }
    }
     else {
        bestTimeFromStorage = localStorage.getItem('Level3');
        if (bestTimeFromStorage === 0){
             localStorage.setItem('Level3',timer);
             gScore3 = timer;
             score = document.querySelector('.score3');
             score.innerText = timer;
            }
        else if (bestTimeFromStorage > timer) {
            localStorage.setItem('Level3', timer)
            gScore3 = timer;
            score = document.querySelector('.score3');
            score.innerText = timer;
        }
    }
}

