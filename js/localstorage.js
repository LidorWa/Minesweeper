'use strict'
var gScore1 = 0;
var gScore1 = 0;
var gScore1 = 0;
// function onPageLoadLocalStorage() {
//     var playerName = localStorage.getItem('playerName');
//     if (playerName !== null) {
//         // header.innerText = 'Hello ' + playerName + ', welcome back to Minesweeper game!';
//     } else {
//         handleNewPlayer();
//     }
// }

function handleNewPlayer() {
    var playerName = localStorage.getItem('playerName');
    playerName = prompt('Whats your name?');
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('bestTime', 0);
    localStorage.setItem('currentTime', 0);
    init();
}

function handleTime(timer) {
    var bestTimeFromStorage = localStorage.getItem('bestTime');
    localStorage.setItem('currentTime', timer);
    if (bestTimeFromStorage === null || bestTimeFromStorage === '0' || bestTimeFromStorage > timer) {
        localStorage.setItem('bestTime', timer)
        if (bestTimeFromStorage === '0') { console.log('Thats your first game, your time is:', timer)
    } else {
        console.log('You did better than before - ' + bestTimeFromStorage + ', your time now is: ' + timer);
    }
    } else if (bestTimeFromStorage < timer) {
        console.log('One of your previous games was faster - ' + bestTimeFromStorage  +', your time now -', timer);
    }
}
