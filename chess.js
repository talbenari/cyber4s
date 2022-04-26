const MYBODY = document.body;
const BOARD_SIZE = 8;
const DARK_PLAYER = 'dark';
const WHITE_PLAYER = 'white';
const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';
const CHESS_BOARD_ID = 'chess-board';

let table = document.createElement('table');
let selectedCell;
let boardData;
let pieces = [];

function getInitialBoard() {
    let result = [];
    addPiece(result, 0, WHITE_PLAYER);
    addPiece(result, 7, DARK_PLAYER);

    for (i = 0; i < BOARD_SIZE; i++) {
        result.push(new Piece(1, i, "pawn", WHITE_PLAYER));
        result.push(new Piece(6, i, "pawn", DARK_PLAYER));
    }
    return result;
}

function addPiece(result, row, player) {
    result.push(new Piece(row, 0, "rook", player));
    result.push(new Piece(row, 1, "knight", player));
    result.push(new Piece(row, 2, "bishop", player));
    result.push(new Piece(row, 3, "queen", player));
    result.push(new Piece(row, 4, "king", player));
    result.push(new Piece(row, 5, "bishop", player));
    result.push(new Piece(row, 6, "knight", player));
    result.push(new Piece(row, 7, "rook", player));
}

function addImage(cell, player, name) {
    const image = document.createElement('img');
    image.src = player + '/' + name + '.png';
    cell.appendChild(image);
}

function displayPossibleMove(row, col) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            table.rows[i].cells[j].classList.remove('possible-move');
            table.rows[i].cells[j].classList.remove('selected');
        }
    }
    const piece = boardData.getPiece(row, col);
    if (piece !== undefined) {
        let possibleMoves = piece.getPossibleMoves(boardData);
        for (let possibleMove of possibleMoves) {
           const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
           cell.classList.add('possible-move');
        }
    }
    table.rows[row].cells[col].classList.add('selected');
    selectedCell = piece;
}
function onCellClick(event, row, col) {
    if (selectedCell === undefined) {
        displayPossibleMove(row, col);
    } else {
        if (tryToMovePiece(selectedCell, row, col)) {
            selectedCell = undefined;
            chessBoardCreation(boardData);
        } else {
            displayPossibleMove(row, col);
        }
    }
}
function tryToMovePiece(piece, row, col) {
    const possibleMoves = piece.getPossibleMoves(boardData);
    for (const possibleMove of possibleMoves) {
        if (possibleMove[0] === row && possibleMove[1] === col) {
            boardData.removePiece(row, col);
            piece.row = row;
            piece.col = col;
            return true;
        }
    }
    return false;
}

function initGame() {
    boardData = new BoardData(getInitialBoard());
    chessBoardCreation(boardData);
  }



function chessBoardCreation(boardData) {
    table = document.getElementById(CHESS_BOARD_ID);
    if (table !== null) {
        table.remove();
    }
    table = document.createElement('table');
    table.id = CHESS_BOARD_ID;
    document.body.appendChild(table);
    for (let row = 0; row < BOARD_SIZE; row++) {
        const rowElement = table.insertRow();
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = rowElement.insertCell();
            if ((row + col) % 2 === 0) {
                cell.className = 'light-cell';
            } else {
                cell.className = 'dark-cell';
            }
            cell.addEventListener('click', (event) => onCellClick(event, row, col));
        }
    }
    for (let piece of boardData.pieces) {
        const cell = table.rows[piece.row].cells[piece.col];
        addImage(cell, piece.player, piece.type);

    }

}
window.addEventListener('load', initGame)

