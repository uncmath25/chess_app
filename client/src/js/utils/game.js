import * as Piece from './piece';

export const BOARD_SIZE = 8;
const COLS = 'abcdefgh';
const KEY_IS_VIEW_WHITE = "IS_VIEW_WHITE";
const KEY_WHITE_PIECES = "WHITE_PIECES";
const KEY_BLACK_PIECES = "BLACK_PIECES";
const KEY_IS_GAME_OVER = "IS_GAME_OVER";
const KEY_IS_WHITE_TURN = "IS_WHITE_TURN";
const KEY_SELECTED_SQUARE = "SELECTED_SQUARE";

export const getSquareNotation = (row, col) => COLS[col] + (row + 1);

export const isViewWhite = (game) => game[KEY_IS_VIEW_WHITE];
const existsWhitePiece = (game, row, col) => game[KEY_WHITE_PIECES][getSquareNotation(row, col)] != null;
export const getWhitePiece = (game, row, col) => game[KEY_WHITE_PIECES][getSquareNotation(row, col)];
const existsBlackPiece = (game, row, col) => game[KEY_BLACK_PIECES][getSquareNotation(row, col)] != null;
export const getBlackPiece = (game, row, col) => game[KEY_BLACK_PIECES][getSquareNotation(row, col)];
export const isGameOver = (game) => game[KEY_IS_GAME_OVER];
export const isWhiteTurn = (game) => game[KEY_IS_WHITE_TURN];
export const getSelectedSquare = (game) => game[KEY_SELECTED_SQUARE];

export const changeView = (game) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_IS_VIEW_WHITE] = !game[KEY_IS_VIEW_WHITE];
  return newGame;
};
export const endGame = (game) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_IS_GAME_OVER] = false;
  return newGame;
};
export const endTurn = (game) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_IS_WHITE_TURN] = !game[KEY_IS_WHITE_TURN];
  return newGame;
};
export const isSquareSelected = (game, row, col) => {
  return getSelectedSquare(game) == getSquareNotation(row, col);
};
export const clearSelectedSquare = (game) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_SELECTED_SQUARE] = "";
  return newGame;
};
export const isSelectedSquareMovable = (game, row, col) => {
  return (isWhiteTurn(game) && existsWhitePiece(game, row, col)) ||
  (!isWhiteTurn(game) && existsBlackPiece(game, row, col))
};
export const setSelectedSquare = (game, row, col) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_SELECTED_SQUARE] = getSquareNotation(row, col);
  return newGame;
};

export const init = () => ({
  [KEY_IS_VIEW_WHITE]: true,
  [KEY_WHITE_PIECES]: initWhitePieces(),
  [KEY_BLACK_PIECES]: initBlackPieces(),
  [KEY_IS_WHITE_TURN]: true,
  [KEY_SELECTED_SQUARE]: ""
});

const initWhitePieces = () => {
  let boardInfo = {};
  for (var col = 0; col < BOARD_SIZE; col++) {
    boardInfo[getSquareNotation(1, col)] = Piece.PAWN;
  }
  boardInfo[getSquareNotation(0, 0)] = Piece.ROOK;
  boardInfo[getSquareNotation(0, 1)] = Piece.KNIGHT;
  boardInfo[getSquareNotation(0, 2)] = Piece.BISHOP;
  boardInfo[getSquareNotation(0, 3)] = Piece.QUEEN;
  boardInfo[getSquareNotation(0, 4)] = Piece.KING;
  boardInfo[getSquareNotation(0, 5)] = Piece.BISHOP;
  boardInfo[getSquareNotation(0, 6)] = Piece.KNIGHT;
  boardInfo[getSquareNotation(0, 7)] = Piece.ROOK;
  return boardInfo;
};

const initBlackPieces = () => {
  let boardInfo = {};
  for (var col = 0; col < BOARD_SIZE; col++) {
    boardInfo[getSquareNotation(6, col)] = Piece.PAWN;
  }
  boardInfo[getSquareNotation(7, 0)] = Piece.ROOK;
  boardInfo[getSquareNotation(7, 1)] = Piece.KNIGHT;
  boardInfo[getSquareNotation(7, 2)] = Piece.BISHOP;
  boardInfo[getSquareNotation(7, 3)] = Piece.QUEEN;
  boardInfo[getSquareNotation(7, 4)] = Piece.KING;
  boardInfo[getSquareNotation(7, 5)] = Piece.BISHOP;
  boardInfo[getSquareNotation(7, 6)] = Piece.KNIGHT;
  boardInfo[getSquareNotation(7, 7)] = Piece.ROOK;
  return boardInfo;
};
