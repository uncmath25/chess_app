import * as Board from './board';
import * as Castle from './castle';
import * as Move from './move';

export const AI_TYPE_RANDOM = "RANDOM";
export const AI_TYPE_DEPTH_1 = "DEPTH_1";
export const AI_TYPE_DEPTH_2 = "DEPTH_2";

const KEY_TYPE = "TYPE";

const getType = (config) => config[KEY_TYPE];
export const setType = (config, type) => { config[KEY_TYPE] = type; }

export const getMove = (config, board, isWhiteTurn, castle) => {
  const startTime = Date.now();
  const move = chooseMove(config, board, isWhiteTurn, castle);
  console.log(`AI choice took ${(Date.now() - startTime) / 1000} seconds`);
  return move;
};

export const chooseMove = (config, board, isWhiteTurn, castle) => {
  switch (getType(config)) {
    case AI_TYPE_RANDOM:
      return chooseRandomMove(board, isWhiteTurn, castle);
    case AI_TYPE_DEPTH_1:
      return chooseMaxPointGainMove(board, isWhiteTurn, castle, 1)[0];
    case AI_TYPE_DEPTH_2:
      return chooseMaxPointGainMove(board, isWhiteTurn, castle, 2)[0];
  }
  console.log(`ERROR: AI type '${getType(config)}' not supported`);
};

export const chooseRandomMove = (board, isWhiteTurn, castle) => {
  let move = [];
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  shuffle(Object.keys(pieces)).forEach((square) => {
    const moves = Move.getLegalMoves(board, isWhiteTurn, castle, square);
    if (moves.length > 0) {
      move = [square, shuffle(moves)[0]];
      return;
    }
  });
  if (move == []) { console.log("ERROR: Random AI could not find a move!"); }
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

export const chooseMaxPointGainMove = (board, isWhiteTurn, castle, depth) => {
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  const otherPieces = isWhiteTurn ? Board.getBlackPieces(board) : Board.getWhitePieces(board);
  let bestMove = [];
  let bestPointGain = -1;
  shuffle(Object.keys(pieces)).forEach((square) => {
    const moves = Move.getLegalMoves(board, isWhiteTurn, castle, square);
    shuffle(moves).forEach((move) => {
      let pointGain = otherPieces[move] ? Board.getPoint(otherPieces[move]) : 0;
      if (depth > 0) {
        const testBoard = Board.copy(board);
        Board.move(testBoard, isWhiteTurn, square, move);
        const testCastle = {...castle};
        Castle.update(testCastle, square);
        pointGain -= chooseMaxPointGainMove(testBoard, !isWhiteTurn, testCastle, depth - 1)[1];
      }
      if (pointGain > bestPointGain) {
        bestMove = [square, move];
        bestPointGain = pointGain;
      }
    });
  });
  if (bestPointGain == -1) {
    // TODO: Review if this works, added to ensure result is given
    bestMove = chooseRandomMove(board, isWhiteTurn, castle);
    bestPointGain = 0;
    if (depth == 2) {
      console.log("Making random move");
    }
  }
  return [bestMove, bestPointGain];
}
