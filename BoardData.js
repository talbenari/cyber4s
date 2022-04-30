class BoardData {
    constructor() {
        this.initPieces();
    }

    initPieces() {
        this.pieces = [];
    
        for (let i = 0; i < BOARD_SIZE; i++) {
          this.pieces.push(new Piece(0, i, PIECES[i], WHITE_PLAYER));
          this.pieces.push(new Piece(1, i, PAWN, WHITE_PLAYER));
          this.pieces.push(new Piece(6, i, PAWN, DARK_PLAYER));
          this.pieces.push(new Piece(7, i, PIECES[i], DARK_PLAYER));
        }
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
    
    removePiece(row, col) {
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (piece.row === row && piece.col === col) {
                this.pieces.splice(i, 1);
                return piece;
            }
        }
    }
}