export const BOARD_SIZE = 8;
const COLS = 'abcdefgh';

export const PAWN = "P";
export const KNIGHT = "N";
export const BISHOP = "B";
export const ROOK = "R";
export const QUEEN = "Q";
export const KING = "K";

export const getSquare = (row, col) => COLS[col] + (row + 1);
export const getSquareCoords = (square) => [parseInt(square[1] - 1), COLS.indexOf(square[0])];

const KEY_WHITE_PIECES = "WHITE_PIECES";
const KEY_BLACK_PIECES = "BLACK_PIECES";

export const init = () => ({
  [KEY_WHITE_PIECES]: initWhitePieces(),
  [KEY_BLACK_PIECES]: initBlackPieces()
});
const initWhitePieces = () => {
  const boardInfo = {};
  for (var col = 0; col < BOARD_SIZE; col++) { boardInfo[getSquare(1, col)] = PAWN; }
  boardInfo[getSquare(0, 0)] = ROOK;
  boardInfo[getSquare(0, 1)] = KNIGHT;
  boardInfo[getSquare(0, 2)] = BISHOP;
  boardInfo[getSquare(0, 3)] = QUEEN;
  boardInfo[getSquare(0, 4)] = KING;
  boardInfo[getSquare(0, 5)] = BISHOP;
  boardInfo[getSquare(0, 6)] = KNIGHT;
  boardInfo[getSquare(0, 7)] = ROOK;
  return boardInfo;
};
const initBlackPieces = () => {
  const boardInfo = {};
  for (var col = 0; col < BOARD_SIZE; col++) { boardInfo[getSquare(6, col)] = PAWN; }
  boardInfo[getSquare(7, 0)] = ROOK;
  boardInfo[getSquare(7, 1)] = KNIGHT;
  boardInfo[getSquare(7, 2)] = BISHOP;
  boardInfo[getSquare(7, 3)] = QUEEN;
  boardInfo[getSquare(7, 4)] = KING;
  boardInfo[getSquare(7, 5)] = BISHOP;
  boardInfo[getSquare(7, 6)] = KNIGHT;
  boardInfo[getSquare(7, 7)] = ROOK;
  return boardInfo;
};

export const copy = (board) => ({
  [KEY_WHITE_PIECES]: {...getWhitePieces(board)},
  [KEY_BLACK_PIECES]: {...getBlackPieces(board)}
});

export const isWhitePiece = (board, square) => board[KEY_WHITE_PIECES][square] != null;
export const getWhitePiece = (board, square) => board[KEY_WHITE_PIECES][square];
export const getWhitePieces = (board) => board[KEY_WHITE_PIECES];
export const isBlackPiece = (board, square) => board[KEY_BLACK_PIECES][square] != null;
export const getBlackPiece = (board, square) => board[KEY_BLACK_PIECES][square];
export const getBlackPieces = (board) => board[KEY_BLACK_PIECES];

export const move = (board, isWhiteTurn, oldSquare, newSquare) => {
  if (isWhiteTurn) {
    addWhitePiece(board, newSquare, getWhitePiece(board, oldSquare));
    removeWhitePiece(board, oldSquare);
    if (isBlackPiece(board, newSquare)) { removeBlackPiece(board, newSquare); }
    handleSpecialCases(getWhitePieces(board), newSquare);
  } else {
    addBlackPiece(board, newSquare, getBlackPiece(board, oldSquare));
    removeBlackPiece(board, oldSquare);
    if (isWhitePiece(board, newSquare)) { removeWhitePiece(board, newSquare); }
    handleSpecialCases(getBlackPieces(board), newSquare);
  }
};
const addWhitePiece = (board, square, piece) => { getWhitePieces(board)[square] = piece; };
const removeWhitePiece = (board, square) => { delete getWhitePieces(board)[square]; };
const addBlackPiece = (board, square, piece) => { getBlackPieces(board)[square] = piece; };
const removeBlackPiece = (board, square) => { delete getBlackPieces(board)[square]; };

const handleSpecialCases = (pieces, newSquare) => {
  handlePawnPromotion(pieces, newSquare);
  handleCastles(pieces, newSquare);
  // TODO: Handle en passant
}
// TODO: Update pawn promotion besides just queen
const handlePawnPromotion = (pieces, newSquare) => {
  const [row, col] = getSquareCoords(newSquare);
  if (pieces[newSquare] == PAWN && (row == 0 || row == BOARD_SIZE - 1)) {
    pieces[newSquare] = QUEEN;
  }
}
// HARD_CODED
const handleCastles = (pieces, newSquare) => {
  if (pieces[newSquare] != KING) { return; }
  if (newSquare == "g1") { updateRookCastle(pieces, "h1", "f1"); }
  if (newSquare == "c1") { updateRookCastle(pieces, "a1", "d1"); }
  if (newSquare == "g8") { updateRookCastle(pieces, "h8", "f8"); }
  if (newSquare == "c8") { updateRookCastle(pieces, "a8", "d8"); }
}
const updateRookCastle = (pieces, oldSquare, newSquare) => {
  delete pieces[oldSquare];
  pieces[newSquare] = ROOK;
}

export const getPoints = (board, isWhite) => {
  const pieces = isWhite ? getWhitePieces(board) : getBlackPieces(board);
  return Object.keys(pieces).map(square => PIECE_POINTS[pieces[square]]).reduce((p1, p2) => p1 + p2);
};
const PIECE_POINTS = {
  [PAWN]: 1,
  [KNIGHT]: 3,
  [BISHOP]: 3,
  [ROOK]: 5,
  [QUEEN]: 9,
  [KING]: 0
};
