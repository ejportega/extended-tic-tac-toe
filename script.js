const cells = document.querySelectorAll(".cell");
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
var game = true;
var state = [0,0,0,0,0,0,0,0,0];
const HUMAN = false;
const COMPUTER = true;
const HUMAN_VAL = -1;
const COMPUTER_VAL = 1;

function start() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        state[i] = 0;
    }

    game = true;
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

function minimax(board, depth, player) {
		
    if (checkWin(board, !player)) 
        return -10 + depth;
    if (checkFull(board)) 
        return 0;

    var value = (player == HUMAN) ? HUMAN_VAL : COMPUTER_VAL;
    var max = -Infinity;
    var index = 0;
    
    for (var i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            var newBoard = board.slice();
            newBoard[i] = value;
            moveval = -minimax(newBoard, depth+1, !player);
            
            
            if (moveval > max) {
                max = moveval;
                index = i;
            }
        }
    }

    if (depth == 0) 
        set(index, COMPUTER);
    
    return max;
}

start();
