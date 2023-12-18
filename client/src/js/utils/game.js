import * as Move from '../utils/move';
import * as Board from './board';

const KEY_IS_VIEW_WHITE = "IS_VIEW_WHITE";
const KEY_WHITE_PIECES = "WHITE_PIECES";
const KEY_BLACK_PIECES = "BLACK_PIECES";
const KEY_IS_GAME_OVER = "IS_GAME_OVER";
const KEY_IS_WHITE_TURN = "IS_WHITE_TURN";
const KEY_SELECTED_SQUARE = "SELECTED_SQUARE";
const KEY_POSSIBLE_MOVE_SQUARES = "POSSIBLE_MOVE_SQUARES";

export const isViewWhite = (game) => game[KEY_IS_VIEW_WHITE];
const existsWhitePiece = (game, row, col) => game[KEY_WHITE_PIECES][Board.getSquareNotation(row, col)] != null;
export const getWhitePiece = (game, row, col) => game[KEY_WHITE_PIECES][Board.getSquareNotation(row, col)];
const getWhitePieces = (game) => game[KEY_WHITE_PIECES];
const existsBlackPiece = (game, row, col) => game[KEY_BLACK_PIECES][Board.getSquareNotation(row, col)] != null;
export const getBlackPiece = (game, row, col) => game[KEY_BLACK_PIECES][Board.getSquareNotation(row, col)];
const getBlackPieces = (game) => game[KEY_BLACK_PIECES];
export const isGameOver = (game) => game[KEY_IS_GAME_OVER];
export const isWhiteTurn = (game) => game[KEY_IS_WHITE_TURN];
export const existsSelectedSquare = (game) => game[KEY_SELECTED_SQUARE] != "" ;
export const getSelectedSquare = (game) => game[KEY_SELECTED_SQUARE];
export const getPossibleMoveSquares = (game) => game[KEY_POSSIBLE_MOVE_SQUARES];

export const changeView = (game) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_IS_VIEW_WHITE] = !game[KEY_IS_VIEW_WHITE];
  return newGame;
};
export const isSquareSelected = (game, row, col) => {
  return getSelectedSquare(game) == Board.getSquareNotation(row, col);
};
export const isSelectionPossible = (game, row, col) => {
  return (isWhiteTurn(game) && existsWhitePiece(game, row, col)) ||
  (!isWhiteTurn(game) && existsBlackPiece(game, row, col))
};
export const isMovePossible = (game, row, col) => {
  return getPossibleMoveSquares(game).includes(Board.getSquareNotation(row, col));
};

export const init = () => ({
  [KEY_IS_VIEW_WHITE]: true,
  [KEY_WHITE_PIECES]: initWhitePieces(),
  [KEY_BLACK_PIECES]: initBlackPieces(),
  [KEY_IS_GAME_OVER]: false,
  [KEY_IS_WHITE_TURN]: true,
  [KEY_SELECTED_SQUARE]: "",
  [KEY_POSSIBLE_MOVE_SQUARES]: []
});
const initWhitePieces = () => {
  let boardInfo = {};
  for (var col = 0; col < Board.BOARD_SIZE; col++) {
    boardInfo[Board.getSquareNotation(1, col)] = Board.PAWN;
  }
  boardInfo[Board.getSquareNotation(0, 0)] = Board.ROOK;
  boardInfo[Board.getSquareNotation(0, 1)] = Board.KNIGHT;
  boardInfo[Board.getSquareNotation(0, 2)] = Board.BISHOP;
  boardInfo[Board.getSquareNotation(0, 3)] = Board.QUEEN;
  boardInfo[Board.getSquareNotation(0, 4)] = Board.KING;
  boardInfo[Board.getSquareNotation(0, 5)] = Board.BISHOP;
  boardInfo[Board.getSquareNotation(0, 6)] = Board.KNIGHT;
  boardInfo[Board.getSquareNotation(0, 7)] = Board.ROOK;
  return boardInfo;
};
const initBlackPieces = () => {
  let boardInfo = {};
  for (var col = 0; col < Board.BOARD_SIZE; col++) {
    boardInfo[Board.getSquareNotation(6, col)] = Board.PAWN;
  }
  boardInfo[Board.getSquareNotation(7, 0)] = Board.ROOK;
  boardInfo[Board.getSquareNotation(7, 1)] = Board.KNIGHT;
  boardInfo[Board.getSquareNotation(7, 2)] = Board.BISHOP;
  boardInfo[Board.getSquareNotation(7, 3)] = Board.QUEEN;
  boardInfo[Board.getSquareNotation(7, 4)] = Board.KING;
  boardInfo[Board.getSquareNotation(7, 5)] = Board.BISHOP;
  boardInfo[Board.getSquareNotation(7, 6)] = Board.KNIGHT;
  boardInfo[Board.getSquareNotation(7, 7)] = Board.ROOK;
  return boardInfo;
};

export const clearSelection = (game) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_SELECTED_SQUARE] = "";
  newGame[KEY_POSSIBLE_MOVE_SQUARES] = [];
  return newGame;
};

export const select = (game, row, col) => {
  const newGame = Object.assign({}, game);
  newGame[KEY_SELECTED_SQUARE] = Board.getSquareNotation(row, col);
  newGame[KEY_POSSIBLE_MOVE_SQUARES] = Move.getMoves(row, col,
    isWhiteTurn(game) ? getWhitePieces(game) : getBlackPieces(game),
    isWhiteTurn(game) ? getBlackPieces(game) : getWhitePieces(game),
    isWhiteTurn(game)
  );
  return newGame;
};

export const move = (game, row, col) => {
  let newGame = Object.assign({}, game);
  newGame[KEY_SELECTED_SQUARE] = "";
  newGame[KEY_POSSIBLE_MOVE_SQUARES] = [];
  newGame[KEY_IS_WHITE_TURN] = !game[KEY_IS_WHITE_TURN];
  const [selectedRow, selectedCol] = Board.getRawCoords(getSelectedSquare(game));
  if (isWhiteTurn(game)) {
    addWhitePiece(newGame, row, col, getWhitePiece(game, selectedRow, selectedCol));
    removeWhitePiece(newGame, selectedRow, selectedCol);
    if (existsBlackPiece(game, row, col)) { removeBlackPiece(newGame, row, col); }
  } else {
    addBlackPiece(newGame, row, col, getBlackPiece(game, selectedRow, selectedCol));
    removeBlackPiece(newGame, selectedRow, selectedCol);
    if (existsWhitePiece(game, row, col)) { removeWhitePiece(newGame, row, col); }
  }
  // TODO: Handle special moves - promotion, castle, en passant
  return newGame;
};
const addWhitePiece = (game, row, col, piece) => {
  getWhitePieces(game)[Board.getSquareNotation(row, col)] = piece;
};
const removeWhitePiece = (game, row, col) => {
  delete getWhitePieces(game)[Board.getSquareNotation(row, col)];
};
const addBlackPiece = (game, row, col, piece) => {
  getBlackPieces(game)[Board.getSquareNotation(row, col)] = piece;
};
const removeBlackPiece = (game, row, col) => {
  delete getBlackPieces(game)[Board.getSquareNotation(row, col)];
};

// TODO: Update pawn promotion besides just queen
// const handlePawnPromotion = (pieces, oldSquare, newSquare) => {
//   if (pieces[oldSquare] == Board.PAWN && (newSquare[1] == 1 || newSquare[1] == Game.BOARD_SIZE)) {
//     pieces[newSquare] = Board.QUEEN;
//   }
// }

// const handleCastles = (pieces, oldSquare, newSquare) => {
//   [1, Game.BOARD_SIZE].forEach((row) => {
//     if (oldSquare == "e" + row) {
//       if (newSquare == "g" + row) {
//         pieces["g" + row] = Board.KING;
//         pieces["f" + row] = Board.ROOK;
//         pieces["h" + row] = "";
//       }
//       if (newSquare == "a" + row) {
//         pieces["c" + row] = Board.KING;
//         pieces["d" + row] = Board.ROOK;
//         pieces["a" + row] = "";
//       }
//     }
//   });
// }
