const cells = document.querySelectorAll(".cell");
var board = [];
const HUMAN = "X";
const COMPUTER = "O";
var game = true;
// winMatrix = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6]
// ];
winMatrix = [];
setWinMatrix();

const sound = new Audio();
var firstTurn = COMPUTER;
var humanScore = 0;
var computerScore = 0;
var tieScore = 0;
var winCombo = [];

start();

function start() {
  game = true;
  firstTurn = firstTurn == COMPUTER ? HUMAN : COMPUTER;
  for (var i = 0; i < cells.length; i++) {
    board[i] = i;
    cells[i].innerText = "";
    cells[i].id = i;
    cells[i].addEventListener("click", turnClick, false);
    cells[i].classList.add("cell-hover");
    cells[i].classList.remove("blinking");
    document.getElementById("start").removeEventListener("click", start, false);
    updateScore();
  }
  if (firstTurn == COMPUTER) {
    var aiturn = aiTurn();
    // console.log(aiturn);
    turn(aiturn.index, COMPUTER);
  }
}

function turnClick(cell) {
  if (game && typeof board[cell.target.id] == "number") {
    turn(cell.target.id, HUMAN);
    if (!checkFull() && !checkWin(board, HUMAN)) {
      setTimeout(function () {
        var aiturn = aiTurn();
        console.log(aiturn);
        turn(aiturn.index, COMPUTER);
      }, 300);
    }
  }
}

function turn(cellId, player) {
  board[cellId] = player;
  document.getElementById(cellId).innerText = player;
  document.getElementById(cellId).classList.remove("cell-hover");
  playSound("click");

  if (gameOver(player)) {
    document.getElementById("start").addEventListener("click", start, false);
  }
}

function checkWin(board, player) {
  for (var i = 0; i < winMatrix.length; i++) {
    var win = true;
    var winTemp = [];
    for (var j = 0; j < winMatrix[i].length; j++) {
      winTemp.push(winMatrix[i][j]);
      if (board[winMatrix[i][j]] != player) {
        win = false;
        break;
      }
    }
    if (win) {
      winCombo = winTemp;
      return true;
    }
  }
  return false;
}

function checkFull() {
  if (emptySquares(board).length == 0) {
    return true;
  }
  return false;
}

function emptySquares(newBoard) {
  return newBoard.filter(x => typeof x == "number");
}

function aiTurn() {
  // return emptySquares(board)[0];
  return minimax(board, 0, COMPUTER);
}

function getAvailSpots(newBoard) {
  availSpots = []
  for (var i = 0; i < newBoard.length; i++) {
    if (typeof (newBoard[i]) == typeof (0) &&
      ((i + 6) <= 35 && typeof (newBoard[i + 6]) != typeof (0)) ||
      ((i + 6) > 35 && typeof (newBoard[i]) == typeof (0)))
      availSpots.push(newBoard[i])
  }
  return availSpots
}

function minimax(newBoard, depth, player) {
  var availSpots = getAvailSpots(newBoard);

  if (checkWin(newBoard, player) || depth >= 5)
    return { score: depth - 100 };
  else if (checkWin(newBoard, COMPUTER) || depth >= 5)
    return { score: 100 - depth };
  else if (availSpots.length == 0 || depth >= 5)
    return { score: 0 };

  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == COMPUTER) {
      var result = minimax(newBoard, depth + 1, HUMAN);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, depth + 1, COMPUTER);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  } 

  var bestMove;
  if (player == COMPUTER) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function playSound(soundType) {
  sound.src = `../static/sound/${soundType}.mp3`;
  sound.play();
}

function updateScore() {
  document.getElementById("humanScore").innerText = humanScore;
  document.getElementById("computerScore").innerText = computerScore;
  document.getElementById("tieScore").innerText = tieScore;
}

function reset() {
  firstTurn = COMPUTER;
  humanScore = 0;
  computerScore = 0;
  tieScore = 0;
  start();
}

function gameOver(player) {
  if (checkWin(board, player)) {
    setTimeout(function () { playSound("victory"); }, 100);
    if (player == HUMAN) humanScore++;
    else computerScore++;
    updateScore();
    for (var i = 0; i < winCombo.length; i++)
      cells[winCombo[i]].classList.add("blinking");

    var availSpots = emptySquares(board);
    for (var i = 0; i < availSpots.length; i++)
      cells[availSpots[i]].classList.remove("cell-hover");
    return true;
  }
  else if (checkFull()) {
    document.getElementById("start").addEventListener("click", start, false);
    setTimeout(function () {
      playSound("draw-lose");
    }, 100);
    tieScore++;
    updateScore();
    for (var i = 0; i < cells.length; i++)
      cells[i].classList.add("blinking");
    return true;
  }
  return false;
}

function setWinMatrix() {
  var n = 6;
  var ctr = 0;
  var temp = [];
  for (var i = 0; i < n; i++) {
    q = [];
    for (var j = 0; j < n; j++)
      q.push(ctr++);
    temp.push(q);
  }

  for (var i = 0; i < 54; i++)
    winMatrix.push([]);

  var x = 0; y = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j <= n - 4; j++) {
      var m = 0;
      for (var k = j; k < j + 4; k++) {
        // horizontal 18
        winMatrix[x].push(temp[i][k]);
        // vertical 18
        winMatrix[x + 1].push(temp[k][i]);

        // diagonal 18
        if (i <= n - 4) {
          winMatrix[x + 2].push(temp[i + m][k]);
          winMatrix[x + 3].push(temp[(n - 1) - (i + m++)][k]);
          y = 4;
        }
        else y = 2;
      }
      x += y;
    }
  }
}