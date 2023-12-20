// Manages whether castles are possible - based on whether king or rooks haved moved
const WHITE_KING_STARTING_SQUARE = "e1";
const WHITE_SHORT_ROOK_STARTING_SQUARE = "h1";
const WHITE_LONG_ROOK_STARTING_SQUARE = "a1";
const BLACK_KING_STARTING_SQUARE = "e8";
const BLACK_SHORT_ROOK_STARTING_SQUARE = "h8";
const BLACK_LONG_ROOK_STARTING_SQUARE = "a8";

const KEY_WHITE_SHORT_POSSIBLE = "WHITE_SHORT_POSSIBLE";
const KEY_WHITE_LONG_POSSIBLE = "WHITE_LONG_POSSIBLE";
const KEY_BLACK_SHORT_POSSIBLE = "BLACK_SHORT_POSSIBLE";
const KEY_BLACK_LONG_POSSIBLE = "BLACK_LONG_POSSIBLE";

export const init = () => ({
  [KEY_WHITE_SHORT_POSSIBLE]: true,
  [KEY_WHITE_LONG_POSSIBLE]: true,
  [KEY_BLACK_SHORT_POSSIBLE]: true,
  [KEY_BLACK_LONG_POSSIBLE]: true
});
export const initNotPossible = () => ({
  [KEY_WHITE_SHORT_POSSIBLE]: false,
  [KEY_WHITE_LONG_POSSIBLE]: false,
  [KEY_BLACK_SHORT_POSSIBLE]: false,
  [KEY_BLACK_LONG_POSSIBLE]: false
});

export const getCastleBetweenSquares = (isWhite, isShort) => {
  if (isShort) { return isWhite ? ["f1", "g1"] : ["f8", "g8"]; }
  return isWhite ? ["b1", "c1", "d1"] : ["b8", "c8", "d8"];
}
export const getCastleCheckSquares = (isWhite, isShort) => {
  if (isShort) { return isWhite ? ["e1", "f1", "g1"] : ["e8", "f8", "g8"]; }
  return isWhite ? ["c1", "d1", "e1"] : ["c8", "d8", "e8"];
}
export const getCastleSquare = (isWhite, isShort) => {
  if (isShort) { return isWhite ? "g1" : "g8"; }
  return isWhite ? "c1" : "c8";
}

export const isPossible = (castle, isWhite, isShort) => {
  if (isWhite) {
    return isShort ? castle[KEY_WHITE_SHORT_POSSIBLE] : castle[KEY_WHITE_LONG_POSSIBLE];
  }
  return isShort ? castle[KEY_BLACK_SHORT_POSSIBLE] : castle[KEY_BLACK_LONG_POSSIBLE];
};

export const update = (castle, square) => {
  if (square == WHITE_KING_STARTING_SQUARE) {
    castle[KEY_WHITE_SHORT_POSSIBLE] = false;
    castle[KEY_WHITE_LONG_POSSIBLE] = false;
  }
  if (square == WHITE_SHORT_ROOK_STARTING_SQUARE) { castle[KEY_WHITE_SHORT_POSSIBLE] = false; }
  if (square == WHITE_LONG_ROOK_STARTING_SQUARE) { castle[KEY_WHITE_LONG_POSSIBLE] = false; }
  if (square == BLACK_KING_STARTING_SQUARE) {
    castle[KEY_BLACK_SHORT_POSSIBLE] = false;
    castle[KEY_BLACK_LONG_POSSIBLE] = false;
  }
  if (square == BLACK_SHORT_ROOK_STARTING_SQUARE) { castle[KEY_BLACK_SHORT_POSSIBLE] = false; }
  if (square == BLACK_LONG_ROOK_STARTING_SQUARE) { castle[KEY_BLACK_LONG_POSSIBLE] = false; }
};
