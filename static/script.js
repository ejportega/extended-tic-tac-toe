const cells = document.querySelectorAll('.cell');
var board = [];
const HUMAN = 'X';
const COMPUTER = 'O';
var game = true;
winMatrix = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const sound = new Audio();
var firstTurn = COMPUTER;
var humanScore = 0;
var computerScore = 0;
var tieScore = 0;

start();

function start() {
  game = true;
  firstTurn = firstTurn == COMPUTER ? HUMAN:COMPUTER;
  for (var i = 0; i < cells.length; i++) {
    board[i] = i;
    cells[i].innerText = '';
    cells[i].id = i;
    cells[i].addEventListener('click', turnClick, false);
    document.getElementById('start').removeEventListener('click', start, false);
    updateScore();
  }
  if (firstTurn == COMPUTER)
    turn(aiTurn(), COMPUTER);
}

function turnClick(cell) {
  if (game && typeof board[cell.target.id] == 'number') {
    turn(cell.target.id, HUMAN)
    if (!checkFull() && !checkWin(board, HUMAN))
      setTimeout(function() { turn(aiTurn(), COMPUTER) }, 300);
  }
}

function turn(cellId, player) {
  board[cellId] = player;
  document.getElementById(cellId).innerText = player;
  document.getElementById(cellId).remove
  playSound('click');

  if (checkWin(board, player)) {
    game = false;
    setTimeout(function() { playSound('victory') }, 100);    
    if (player == HUMAN)
      humanScore++;
    else 
      computerScore++;
    updateScore();
    document.getElementById('start').addEventListener('click', start, false);
  }
}

function checkWin(board, player) {
  for (var i = 0; i < winMatrix.length; i++) {
    var win = true;
    for (var j = 0; j < winMatrix[i].length; j++) {
      if (board[winMatrix[i][j]] != player) {
        win = false;
        break;
      }
    }
    if (win) 
      return true; 
  }
  return false;
}

function checkFull() {
  if (emptySquares(board).length == 0) {
    document.getElementById('start').addEventListener('click', start, false);
    if (!checkWin(board, HUMAN) && !checkWin(board, COMPUTER)) {
      setTimeout(function() { playSound('draw-lose') }, 100);
      tieScore++;
      updateScore();
    }
    return true;
  }
  return false;
}

function emptySquares(newBoard) {
  return newBoard.filter(x => typeof x == 'number');
}

function aiTurn() {
  return emptySquares(board)[0];
}

function playSound(soundType) {
  sound.src = `../static/sound/${soundType}.mp3`;
  sound.play();
}

function updateScore() {
  document.getElementById('humanScore').innerText = humanScore;
  document.getElementById('computerScore').innerText = computerScore;
  document.getElementById('tieScore').innerText = tieScore;
}

function reset() {
  firstTurn = COMPUTER;
  humanScore = 0;
  computerScore = 0;
  tieScore = 0;
  start();
}