const cells = document.querySelectorAll(".cell");
const N = cells.length;
const winMatrix = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
// var winMatrix = [];
var state = [];
var game = true;
const HUMAN = false;
const COMPUTER = true;
const HUMAN_VAL = -1;
const COMPUTER_VAL = 1;

function start() {
    for (var i = 0; i < N; i++) {
        cells[i].innerText = '';
        state[i] = 0;
    }

    game = true;
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
        for (var j = 0; j <= n-4; j++) {
            var m = 0;
            for (var k = j; k < j+4; k++) {
                // horizontal 18
                // winMatrix[x][y] = temp[i][k];
                winMatrix[x].push(temp[i][k]);
                // vertical 18
                // winMatrix[x+1][y] = temp[k][i];
                winMatrix[x+1].push(temp[k][i]);

                // diagonal 18
                if (i <= n-4) {
                    // winMatrix[x+2][y] = temp[i+m][k];
                    // winMatrix[x+3][y] = temp[(n-1)-(i+m++)][k];
                    winMatrix[x+2].push(temp[i+m][k]);
                    winMatrix[x+3].push(temp[(n-1)-(i+m++)][k]);
                    y = 4;
                }
                else y = 2;
            }
            x += y;
        }
    }
}

function set(index, player) {
    if (!game)
        return;
    
    if (state[index] == 0) {
        if (player == HUMAN) {
            cells[index].innerText = 'X';
            state[index] = HUMAN_VAL;
        }
        else {
            cells[index].innerText = 'O';
            state[index] = COMPUTER_VAL;
        }
    }
    
    if (checkWin(state, player)) {
        console.log("GAME OVER");
        game = false;
    }
}

// setWinMatrix();
function turnClick(cell) {
    if (!game)
        return;
    
    for (var i = 0; i < cells.length; i++) {
        if (cells[i] == cell && state[i] == 0) {
            set (i, HUMAN);
            callAI();
        }
    }
}

function checkWin(board, player) {
    var value = (player == HUMAN) ? HUMAN_VAL : COMPUTER_VAL;
		
    for (var i = 0; i < winMatrix.length; i++) {
        var win = true;
        for (var j = 0; j < winMatrix[i].length; j++) {
            if (board[winMatrix[i][j]] != value) {
                win = false;
                break;
            }   
        }
        if (win)
            return true;
    }
    return false;
}

function checkFull(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i] == 0)
            return false;
    }
    return true;
}

function callAI() {
    minimax(state, 0, COMPUTER);
}

function evaluate(board, player) {
    if (player == HUMAN) {
        if (checkWin(board, HUMAN))
            return 10;
    }
    else if (player == COMPUTER) {
        if (checkWin(board, COMPUTER)) {
            return -10;
        }
    }
    else if (checkFull(board))
        return 0;
} 

function minimax(board, player) {
    var availSpots = emptySquares(board); 

    if (player == HUMAN && checkWin(board, player)) // HUMAN
        return {score:10};
    else if (player == COMPUTER && checkWin(board, player)) // COMPUTER
        return {score : -10};
    else if (availSpots.length == 0)
        return {score: 0};

    var value = (player == HUMAN) ? HUMAN_VAL : COMPUTER_VAL;    
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = board[availSpots[i]];
        board[availSpots[i]] = value;

        if (player == COMPUTER) {
            var result = minimax(board, HUMAN);
            move.score = result.score;
        }
        else {
            var result = minimax(board, COMPUTER);
            move.score = result.score;
        }
    }

    
}

function emptySquares(board) {
    return board.filter(x => x == 0);
}

// function minimax(board, depth, player) {
//     if (checkWin(board, !player)) 
//         return -10 + depth;
//     if (checkFull(board)) 
//         return 0;

//     var value = (player == HUMAN) ? HUMAN_VAL : COMPUTER_VAL;
//     var max = -Infinity;
//     var index = 0;
    
//     for (var i = 0; i < board.length; i++) {
//         if (board[i] == 0) {
//             var newBoard = board.slice();
//             newBoard[i] = value;
//             moveval = -minimax(newBoard, depth+1, !player);
            
            
//             if (moveval > max) {
//                 max = moveval;
//                 index = i;
//             }
//         }
//     }

//     if (depth == 0) 
//         set(index, COMPUTER);
    
//     return max;
// }

start();
