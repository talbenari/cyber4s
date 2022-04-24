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

let table = document.createElement('table');
let selectedCell;
let boardData;
let pieces = [];



class Piece {
    constructor(row, col, type, player) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.player = player;
    }

    getPossibleMoves(boardData) {
        let Moves;
        if (this.type === PAWN) {
            Moves = this.getPawnMoves(boardData);
        } else if (this.type === ROOK) {
            Moves = this.getRookMoves(boardData);
        } else if (this.type === KNIGHT) {
            Moves = this.getKnightMoves(boardData);
        } else if (this.type === BISHOP) {
            Moves = this.getBishopMoves(boardData);
        } else if (this.type === KING) {
            Moves = this.getKingtMoves(boardData);
        } else if (this.type === QUEEN) {
            Moves = this.getQueentMoves(boardData);
        } else {
            console.log("Unknown type", type)
        }

        let filteredMoves = [];
        for (let absoluteMove of Moves) {
            const absoluteRow = absoluteMove[0];
            const absoluteCol = absoluteMove[1];
            if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                filteredMoves.push(absoluteMove);
            }
        }
        console.log('filteredMoves', filteredMoves);
        return filteredMoves;
    }


    getPawnMoves(boardData) {
        let result = [];
        let dirction = 1;
        if (this.player === DARK_PLAYER) {
            dirction = -1;
        }
        let nextMoveCell = [this.row + dirction, this.col];
        if (boardData.isEmpty(nextMoveCell)) {
            result.push(nextMoveCell);
        }
        nextMoveCell = [this.row + dirction, this.col + dirction];
        if (boardData.isOpponent(nextMoveCell[0], nextMoveCell[1], this.player)) {
            result.push(nextMoveCell);
        }
        nextMoveCell = [this.row + dirction, this.col - dirction];
        if (boardData.isOpponent(nextMoveCell[0], nextMoveCell[1], this.player)) {
            result.push(nextMoveCell);
        }
        return result;
    }

    getRookMoves(boardData) {
        let result = [];
        result = result.concat(this.getMovesByDirection(1, 0, boardData));
        result = result.concat(this.getMovesByDirection(-1, 0, boardData));
        result = result.concat(this.getMovesByDirection(0, 1, boardData));
        result = result.concat(this.getMovesByDirection(0, -1, boardData));
        return result;
    }

    getBishopMoves(boardData) {
        let result = [];
        for (let i = 1; i < BOARD_SIZE; i++) {
            result = result.concat(this.getMovesByDirection(1, 1, boardData));
            result = result.concat(this.getMovesByDirection(-1, -1, boardData));
            result = result.concat(this.getMovesByDirection(-1, 1, boardData));
            result = result.concat(this.getMovesByDirection(1, -1, boardData));
        }
        return result;
    }
    getKnightMoves(boardData) {
        let result = [];
        const Moves = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
        for (let knightMove of Moves) {
            let row = this.row + knightMove[0];
            let col = this.col + knightMove[1];
            if (!boardData.isSamePlayer(row, col, this.player)) {
                result.push([row, col]);
            }
        }
        return result;
    }
    getKingtMoves(boardData) {
        let result = [];
        const Moves = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, -1], [-1, 0], [0, 1]];
        for (let kingMove of Moves) {
            let row = this.row +kingMove[0];
            let col = this.col + kingMove[1];
            if (!boardData.isSamePlayer(row, col, this.player)) {
                result.push([row, col]);
            }
        }
        return result;
    }
    getQueentMoves(boardData) {
        let result = [];
        result = result.concat(this.getBishopMoves(boardData), this.getRookMoves(boardData));
        return result;
    }
    getMovesByDirection(directionRow, directionCol, boardData) {
        let result = [];
        for (i = 1; i < BOARD_SIZE; i++) {
            let row = this.row + directionRow * i;
            let col = this.col + directionCol * i;
            if (boardData.isEmpty(row, col)) {
                result.push([row, col]);
            }
            else if (boardData.isSamePlayer(row, col, this.player)) {
                return result;
            }
            else if (boardData.isOpponent(row, col, this.player)) {
                result.push([row, col]);
                return result;
            }
        }
        return result;
    }
}

class BoardData {
    constructor(pieces) {
        this.pieces = pieces;
    }
    getPiece(row, col) {
        for (const piece of this.pieces) {
            if (piece.row === row && piece.col === col) {
                return piece;
            }
        }
    }
    isEmpty(row, col) {
        return this.getPiece(row, col) === undefined;
    }
    isSamePlayer(row, col, player) {
        const piece = this.getPiece(row, col);
        return piece !== undefined && piece.player === player;
    }
    isOpponent(row, col, player) {
        const piece = this.getPiece(row, col);
        return piece !== undefined && piece.player !== player;
    }
}

function getInitialBoard() {
    let result = [];
    addPiece(result, 0, WHITE_PLAYER)
    addPiece(result, 7, DARK_PLAYER)

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

function onCellClick(event, row, col) {
    console.log(row);
    console.log(col);
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            table.rows[i].cells[j].classList.remove('possible-move');
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
    if (selectedCell !== undefined) {
        selectedCell.classList.remove('selected');
        // console.log('hi');
    }
    selectedCell = event.currentTarget;
    selectedCell.classList.add('selected');
    // console.log('yay!');
}

function chessBoardCreation() {
    MYBODY.appendChild(table);
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
    boardData = new BoardData(getInitialBoard());

    for (let piece of boardData.pieces) {
        const cell = table.rows[piece.row].cells[piece.col];
        addImage(cell, piece.player, piece.type);

    }

}
window.addEventListener('load', chessBoardCreation)

