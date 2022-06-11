const board = [
    ['X', 'O', 'X'],
    ['O', 'X', 'X'],
    ['O', 'O', 'O']
];

const playerFactory = (name, marker) => {
    return {name, marker}
}

const one = playerFactory('one', 'X');
const two = playerFactory('two', 'O');

const boardDiv = document.querySelector('.board');

function initializeBoard(board) {
    for (i = 0; i < board.length; i++) {
        for (j = 0; j < board[i].length; j++) {
            console.log(board[i][j]);
            let squareDiv = document.createElement('div');
            squareDiv.classList = 'square';
            squareDiv.textContent = board[i][j];

            boardDiv.append(squareDiv);
        }
    }
}



initializeBoard(board);
