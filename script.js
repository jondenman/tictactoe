// board module to contain logic and state of game
const board = (() => {
    const boardArray = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const clearBoard = () => {
        for (i = 0; i < boardArray.length; i++) {
            for (j = 0; j < boardArray[i].length; j++) {
                boardArray[i][j] = '';
            }
        }
    }

    const _isRowWin = (row) => {
        var mark = boardArray[row][0];
        if (mark == '') return false;
        var markMatch = false;
        for (i = 1; i < boardArray[row].length; i++) {
            if (mark == boardArray[row][i]) {
                markMatch = true;
            } else {
                return false;
            }
        }
        return markMatch;
    }

    const _isColWin = (col) => {
        var mark = boardArray[0][col];
        if (mark == '') return false;
        var markMatch = false;
        for (i = 1; i < boardArray.length; i++) {
            if (mark == boardArray[i][col]) {
                markMatch = true;
            } else {
                return false;
            }
        }
        return markMatch;
    }
    
    const _isDiagonalWin = (row, col) => {
        if ((row + col) % 2 != 0) return false; // only check if corner or middle of board
        var mark = boardArray[row][col];
        var markMatch = false;
        if (mark == '') return false;
        if (row == col) { // if top left - bottom right
            for (i = 0; i < boardArray.length; i++) {
                if (mark == boardArray[i][i]) {
                    markMatch = true;
                } else {
                    markMatch = false;
                    break;
                }
            }
        }
        if (row + col == 2) { // if bottom left - top right
            j = 0;
            for (i = boardArray.length - 1; i >= 0; i--) {
                if (mark == boardArray[i][j]) {
                    markMatch = true;
                } else {
                    markMatch = false;
                    break;
                }
                j++;
            }
        }
        return markMatch;

    }

    const _isTie = () => {
        for (i = 0; i < boardArray.length; i++) {
            for (j = 0; j < boardArray[0].length; j++) {
                if (boardArray[i][j] == '') return false;
            }
        }
        return true;
    }
    const isGameOver = (row, col) => {
        if (_isColWin(col)) return true;
        if (_isRowWin(row)) return true;
        if (_isDiagonalWin(row, col)) return true;
        if (_isTie()) return -1;
        return false;
    }

    const markBoard = (mark, row, col) => {
        console.log('mark is: ' + boardArray[row][col]);
        if (boardArray[row][col] == '') {
            boardArray[row][col] = mark;
            displayController.markSquare(flow.getCurrentMark(), row, col);
            flow.toggleMark();
        } else {
            console.log('spot already taken');
        }
        
    }

    return {
        boardArray,
        markBoard, 
        isGameOver,
        clearBoard
    }
})();

const displayController = (() => {
    const initializeBoard = (board) => {
        while (boardDiv.firstChild) {
            boardDiv.removeChild(boardDiv.firstChild);
        }
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                let squareDiv = document.createElement('div');
                squareDiv.classList = 'square';
                squareDiv.textContent = board[i][j];
                squareDiv.setAttribute('data-row', i);
                squareDiv.setAttribute('data-col', j);

                boardDiv.append(squareDiv);
            }
        }
    }
    
    const markSquare = (mark, row, col) => {
        console.log(`${row}`);
        rowDivs = boardDiv.querySelectorAll(`[data-row="${row}"]`);
        squareDiv = rowDivs[col];
        if (squareDiv.textContent == '') {
            squareDiv.textContent = mark;
        } else {
            console.log('spot taken');
        }
    }

    const changePlayerTurnMessage = (element, player) => {
        element.textContent = `${player.name}'s Turn: ${player.marker}`;
    }

    return {
        initializeBoard,
        markSquare,
        changePlayerTurnMessage
    }
})();

// module to control game flow
const gameFlow = (() => {
    let currentMark = 'X';
    let playerOne;
    let playerTwo;
    let currentPlayer;

    const toggleMark = () => {
        if (currentMark == 'O') {
            currentMark = 'X';
        } else {
            currentMark = 'O';
        }
    }

    const switchPlayer = () => {
        if (currentPlayer == playerOne) {
            currentPlayer = playerTwo;
        } else {
            currentPlayer = playerOne;
        }
    }

    const initializePlayers = (one, two) => {
        playerOne = one;
        playerTwo = two;
        currentPlayer = one;
        currentMark = currentPlayer.marker;
    }

    const endGame = () => {
        let squares = document.querySelectorAll('.square');

        squares.forEach(element => {
            element.removeEventListener('click', onClickSquare)
        });
    }

    const getCurrentMark = () => currentMark;
    const getCurrentPlayer = () => currentPlayer;

    return {
        getCurrentMark,
        toggleMark,
        initializePlayers,
        switchPlayer,
        getCurrentPlayer,
        endGame
    }
})();

const playerFactory = (name, marker) => {
    return {name, marker}
}
const form = document.querySelector('form');

const one = playerFactory('one', 'X');
const two = playerFactory('two', 'O');

const boardDiv = document.querySelector('.board');

function onClickSquare(e) {
    let row = e.target.getAttribute('data-row');
    let col = e.target.getAttribute('data-col');
    console.log(`${row}, ${col}`)
    board.markBoard(flow.getCurrentMark(), row, col);
    isOver = board.isGameOver(row, col);
    if (isOver == true) {
        messageDiv.textContent = `Game over. ${gameFlow.getCurrentPlayer().name} wins!`;
        gameFlow.endGame();
        board.clearBoard();
    } else if (isOver == -1) {
        messageDiv.textContent = `Game over. It's a tie.`;
    } else {
        gameFlow.switchPlayer();
        displayController.changePlayerTurnMessage(messageDiv, gameFlow.getCurrentPlayer()); 
    }
    
}

const flow = gameFlow;

const messageDiv = document.querySelector('#message');

const startButton = document.querySelector('#startbtn');

startButton.addEventListener('click', onStartClick);

function onStartClick(e) {
    board.clearBoard();
    displayController.initializeBoard(board.boardArray);

    const squares = document.querySelectorAll('.square');

    squares.forEach(element => {
        element.addEventListener('click', onClickSquare)
    });

    var playerOneName = form[0].value;
    var playerTwoName = form[1].value;

    const playerOne = playerFactory(playerOneName, 'X');
    const playerTwo = playerFactory(playerTwoName, 'O');
    
    gameFlow.initializePlayers(playerOne, playerTwo);

    displayController.changePlayerTurnMessage(messageDiv, gameFlow.getCurrentPlayer());
}
