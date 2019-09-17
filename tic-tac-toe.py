N = 9
board = []
HUMAN = 'X'
COMPUTER = 'O'
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
game = True

def startGame():
  for x in range(N):
    board.append(x)

def getAvailSpots(newBoard):
  availSpots = []
  for i in range(len(newBoard)):
    if (type(newBoard[i]) == type(0) and 
        ((i+3)<=8 and type(newBoard[i+3]) != type(0)) or 
        ((i+3)>8 and type(newBoard[i]) == type(0))):
      availSpots.append(newBoard[i])
  return availSpots

def setTurn(index):
  global game
  if (type(board[index]) == type(0)):
      turn(index, HUMAN)
      if (not checkTie() and not checkWin(board, HUMAN)):
        turn(aiTurn(), COMPUTER)
      else:
        game = False

def turn(index, player):
  global game
  board[index] = player

  if (checkWin(board, player)):
    print("GAME OVER")
    game = False

def checkWin(newBoard, player):
  for i in range(len(winMatrix)):
    win = True
    for j in range(len(winMatrix[i])):
      if (newBoard[winMatrix[i][j]] != player):
        win = False
        break
    if (win):
      return True
  return False

def checkTie():
  if (len(emptySquares(board)) == 0):
    print("Tie Game!")
    return True
  return False

def emptySquares(board):
  return [x for x in board if type(x) == type(0)]

def aiTurn():
  return minimax(board, COMPUTER)['index']
                
def minimax(newBoard, player):
  availSpots = getAvailSpots(newBoard)

  if (checkWin(newBoard, player)):
    return {'score': -10}
  elif (checkWin(newBoard, COMPUTER)):
    return {'score': 10}
  elif (len(availSpots) == 0):
    return {'score': 0}

  moves = []
  for i in range(len(availSpots)):
    move = {}
    move['index'] = newBoard[availSpots[i]]
    newBoard[availSpots[i]] = player

    if (player == COMPUTER):
      result = minimax(newBoard, HUMAN)
      move['score'] = result['score']
    else:
      result = minimax(newBoard, COMPUTER)
      move['score'] = result['score']

    newBoard[availSpots[i]] = move['index']
    moves.append(move)
    
    bestMove = 0
    if (player == COMPUTER):
      bestScore = -10000
      for i in range(len(moves)):
        if (moves[i]['score'] > bestScore):
          bestScore = moves[i]['score']
          bestMove = i
    else:
      bestScore = 10000
      for i in range(len(moves)):
        if (moves[i]['score'] < bestScore):
          bestScore = moves[i]['score']
          bestMove = i

  return moves[bestMove]

def displayBoard():
  for i in range(N):
    if (type(board[i]) == type("s")):
      print(board[i],end=' ')
    else:
      print("_",end=' ')
    if ((i+1)%3==0):
      print("\n")
  print()

if  __name__=="__main__":
  startGame()
  while(game):
    index = int(input("Human turn: "))
    setTurn(index)
    displayBoard()
  print("Thank you for playing!")
