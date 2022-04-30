class Piece {
    constructor(row, col, type, player) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.player = player;
    }

    getOpponent() {
        if (this.player === WHITE_PLAYER) {
            return DARK_PLAYER;
        }
        return WHITE_PLAYER;
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
            Moves = this.getKingMoves(boardData);
        } else if (this.type === QUEEN) {
            Moves = this.getQueenMoves(boardData);
        } else {
            console.log("Unknown type", type)
        }
        let filteredMoves = [];
        for (const absoluteMove of Moves) {
            const absoluteRow = absoluteMove[0];
            const absoluteCol = absoluteMove[1];
            if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                filteredMoves.push(absoluteMove);
            }
        }
        return filteredMoves;
    }

    getPawnMoves(boardData) {
        let result = [];
        let direction = 1;
        if (this.player === DARK_PLAYER) {
            direction = -1;
        }
        // adds pawn's first double move and removes it if the cell is not empty.
        if (this.row === 1 || this.row === 6) {
            let nextMoveCell = [this.row + direction * 2, this.col];
            if (boardData.isEmpty(nextMoveCell[0], nextMoveCell[1])) {
                result.push([this.row + direction * 2, this.col]);
            }
        }
        let nextMoveCell = [this.row + direction, this.col];
        if (boardData.isEmpty(nextMoveCell[0], nextMoveCell[1])) {
            result.push(nextMoveCell);
        }
        nextMoveCell = [this.row + direction, this.col + direction];
        if (boardData.isOpponent(nextMoveCell[0], nextMoveCell[1], this.player)) {
            result.push(nextMoveCell);
        }
        nextMoveCell = [this.row + direction, this.col - direction];
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
    getKingMoves(boardData) {
        let result = [];
        const Moves = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, -1], [-1, 0], [0, 1]];
        for (let kingMove of Moves) {
            let row = this.row + kingMove[0];
            let col = this.col + kingMove[1];
            if (!boardData.isSamePlayer(row, col, this.player)) {
                result.push([row, col]);
            }
        }
        return result;
    }
    getQueenMoves(boardData) {
        let result = [];
        result = result.concat(this.getBishopMoves(boardData), this.getRookMoves(boardData));
        return result;
    }
    getMovesByDirection(directionRow, directionCol, boardData) {
        let result = [];
        for (let i = 1; i < BOARD_SIZE; i++) {
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