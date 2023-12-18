export const BOARD_SIZE = 8;
const COLS = 'abcdefgh';

export const PAWN = "P";
export const KNIGHT = "N";
export const BISHOP = "B";
export const ROOK = "R";
export const QUEEN = "Q";
export const KING = "K";

export const getSquareNotation = (row, col) => COLS[col] + (row + 1);
export const getRawCoords = (square) => [parseInt(square[1] - 1), COLS.indexOf(square[0])];
