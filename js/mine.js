'use strict'

var gLevel = {
    size: 4,
    mines: 2
}

var gBoard = {
    minesAroundCount: gMineCounterAround,
    isShown: false,
    isMine: false,
    isMarked: false

}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gGameBoard;

const MINE = '💣'
const FLAG = '🚩'
var elTimer = document.querySelector('.timer');
var elModal = document.querySelector('.modal');
var elLivesCounter = document.querySelector('.lives')
var elRestart = document.querySelector('.restart')
var gFlagsCounter = gLevel.mines
var gTimer = 0;
var gMineCounterAround = 0;
var gTimeOut;
var glivesCounter = 3


function init() {
    gGameBoard = createBoard()
    renderBoard(gGameBoard)
    setMinesNegsCount()
    elRestart.innerText = '😇'
    gFlagsCounter = gLevel.mines
    document.querySelector('.counter').innerText = gFlagsCounter
    gGame.isOn = false;
    gTimer = 0;
    glivesCounter = 3
    elLivesCounter.innerText = '❤️❤️❤️'
    clearTimeout(gTimeOut)
    elTimer.innerText = gTimer
    elModal.style.display = 'none'
}

function cellClicked(event, i, j) {

    var elCell = document.querySelector('.cell-' + i + '-' + j)

    if (gGameBoard[i][j].isMine) {
        elCell.innerText = MINE
    }
    else {
        gGameBoard[i][j].isShown = true;
        elCell.style.backgroundColor = 'gray'
        gMineCounterAround = countMineAround(i, j);
        elCell.innerText = gMineCounterAround
        if (gMineCounterAround === 0) elCell.innerText = ''
        if (gMineCounterAround === 0) elCell.style.color = 'blue'
        if (gMineCounterAround === 1) elCell.style.color = 'green'
        if (gMineCounterAround === 2) elCell.style.color = 'orange'

    }
    if (!gGame.isOn) {
        startTimer()

        gGame.isOn = true;
    }

    console.table(gGameBoard);
    checkGameOver(gGameBoard[i][j])
}

function setMinesNegsCount() {
    var row = 0;
    var col = 0;
    for (var j = 0; j < gLevel.mines; j++) {
        for (var i = 0; i < 2; i++) {
            if (i === 0) {
                row = getRandomIntInclusiveMy()

            } else {
                col = getRandomIntInclusiveMy()
            }
        }
        gGameBoard[row][col].isMine = true;
    }
}

function cellMarked(event, i, j) {
    var elCell = document.querySelector('.cell-' + i + '-' + j)
    if (!gGameBoard[i][j].isMarked) {
        if (elCell.isShown) return
        else if (gFlagsCounter <= 0) return
        else {
            gGameBoard[i][j].isMarked = true;
            elCell.innerText = FLAG;
        }
        gFlagsCounter--
        document.querySelector('.counter').innerText = gFlagsCounter
    } else {
        gFlagsCounter++
        gGameBoard[i][j].isMarked = false;
        elCell.innerText = '';
        document.querySelector('.counter').innerText = gFlagsCounter
    }

}


function countMineAround(rowIdx, colIdx) {
    var counter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gGameBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gGameBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = gGameBoard[i][j];
            if (cell.isMine) counter++

        }
    }

    if (counter === 0) {

        expandShown(rowIdx, colIdx);
    }
    return counter;
}


function expandShown(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gGameBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gGameBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = gGameBoard[i][j];
            currCell.isShown = true;
            var elCell = document.querySelector('.cell-' + i + '-' + j)
            elCell.style.backgroundColor = "gray"
            elCell.innerText = gMineCounterAround
            if (gMineCounterAround === 0) elCell.innerText = ''
            if (gMineCounterAround === 1) elCell.style.color = 'green'
            if (gMineCounterAround === 2) elCell.style.color = 'orange'

        }
    }
}


function checkGameOver(cell) {
    var markedMines = 0;
    var shownsCells = 0;
    if (cell.isMine) {
        glivesCounter--
        if (glivesCounter <= 0) {
            elModal.style.display = 'block'
            elModal.innerText = 'you lose!!!'
            elRestart.innerText = '🤯'
            elLivesCounter.innerText = '😭😭😭'
            setTimeout(() => {
                init()
            }, 5000);
        }
        else if (glivesCounter === 2) elLivesCounter.innerText = '❤️❤️'
        else if (glivesCounter === 1) elLivesCounter.innerText = '❤️'

    } else {
        for (var i = 0; i < gGameBoard.length; i++) {
            for (var j = 0; j < gGameBoard[0].length; j++) {
                var currCell = gGameBoard[i][j]
                if (currCell.isMine && currCell.isMarked) markedMines++
                if (currCell.isShown) shownsCells++
            }
        }
        if (markedMines === gLevel.mines && shownsCells === gLevel.size ** 2 - gLevel.mines) {
            elModal.style.display = 'block'
            elModal.innerText = 'you win!!!'
            elRestart.innerText = '😎'
        }
    }


}

function startTimer() {
    elTimer.innerText = gTimer
    gTimer = gTimer + 1.0;
    gTimeOut = setTimeout(startTimer, 1000);
}

