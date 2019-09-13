const cells = document.querySelectorAll('.cell');
var board = [];
const HUMAN = 'X';
const COMPUTER = 'O';
var game = true;
winMatrix = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

// setWinMatrix();
start();

function getAvailSpots(newBoard) {
    availSpots = []
    for (var i = 0; i < newBoard.length; i++) {
        if (typeof (newBoard[i]) == typeof(0) && 
        ((i+3)<=8 && typeof(newBoard[i+3]) != typeof(0)) || 
        ((i+3)>8 && typeof(newBoard[i]) == typeof(0)))
        availSpots.push(newBoard[i])
    }
    return availSpots
}

// function setWinMatrix() {
//     var n = 6;
//     var ctr = 0;
//     var temp = [];
//     for (var i = 0; i < n; i++) {
//         q = [];
//         for (var j = 0; j < n; j++) 
//             q.push(ctr++);
//         temp.push(q);
//     }

//     for (var i = 0; i < 54; i++) 
//         winMatrix.push([]);
    
//     var x = 0; y = 0;
//     for (var i = 0; i < n; i++) {
//         for (var j = 0; j <= n-4; j++) {
//             var m = 0;
//             for (var k = j; k < j+4; k++) {
//                 // horizontal 18
//                 winMatrix[x].push(temp[i][k]);
//                 // vertical 18
//                 winMatrix[x+1].push(temp[k][i]);

//                 // diagonal 18
//                 if (i <= n-4) {
//                     winMatrix[x+2].push(temp[i+m][k]);
//                     winMatrix[x+3].push(temp[(n-1)-(i+m++)][k]);
//                     y = 4;
//                 }
//                 else y = 2;
//             }
//             x += y;
//         }
//     }
// }

function start() {
    game = true
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i ++) {
        cells[i].innerText = '';
        cells[i].id = i;
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(cell) {
    if (game && typeof board[cell.target.id] == 'number') { 
        turn(cell.target.id, HUMAN)
        if (!checkTie() && !checkWin(board, HUMAN)) 
            turn(bestSpot(), COMPUTER);
        else   
            game = false;
    }
} 

function turn(cellId, player) {
    board[cellId] = player;
    document.getElementById(cellId).innerText = player;

    if (checkWin(board, player)) {
        console.log("GAME OVER");
        game = false;
    }
}

function checkWin(newBoard, player) {
    for (var i = 0; i < winMatrix.length; i++) {
        var win = true;
        for (var j = 0; j < winMatrix[i].length; j++) {
            if (newBoard[winMatrix[i][j]] != player) {
                win = false;
                break;
            }   
        }
        if (win)
            return true;
    }
    return false;
}

function emptySquares() {
    return board.filter(x => typeof x == 'number');
}

function bestSpot() {
    return minimax(board, COMPUTER).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        console.log("Tie Game!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, player)) 
        return {score: -10};
    else if (checkWin(newBoard, COMPUTER))
        return {score: 10};
    else if (availSpots.length == 0) 
        return {score: 0};

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == COMPUTER) {
            var result = minimax(newBoard, HUMAN);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, COMPUTER);
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
    }
    else {
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