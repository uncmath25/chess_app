import * as Board from './board';
import * as Move from './move';

export const AI_TYPE_RANDOM = "RANDOM";

const KEY_TYPE = "TYPE";

const getType = (config) => config[KEY_TYPE];
export const setType = (config, type) => { config[KEY_TYPE] = type; }

export const getMove = (config, board, isWhiteTurn, castle) => {
  switch (getType(config)) {
    case AI_TYPE_RANDOM:
      return chooseRandomMove(board, isWhiteTurn, castle);
  }
  console.log(`ERROR: AI type '${getType(config)}' not supported`)
};

export const chooseRandomMove = (board, isWhiteTurn, castle) => {
  let move = "";
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  shuffle(Object.keys(pieces)).forEach((square) => {
    const moves = Move.getLegalMoves(board, isWhiteTurn, castle, square);
    if (moves.length > 0) {
      move = [square, shuffle(moves)[0]];
      return;
    }
  });
  if (move == "") { console.log("ERROR: Random AI could not find a move!") }
  return move;
};

const shuffle = (arr) => {
  let idx = arr.length, randIdx;
  while (idx > 0) {
    randIdx = Math.floor(Math.random() * idx);
    idx--;
    [arr[idx], arr[randIdx]] = [arr[randIdx], arr[idx]];
  }
  return arr;
};
