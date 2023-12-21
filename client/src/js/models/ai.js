import * as Board from './board';
import * as Move from './move';

export const AI_TYPE_RANDOM = "RANDOM";
export const AI_TYPE_DEPTH_1 = "DEPTH_1";

const KEY_TYPE = "TYPE";

const getType = (config) => config[KEY_TYPE];
export const setType = (config, type) => { config[KEY_TYPE] = type; }

export const getMove = (config, board, isWhiteTurn, castle) => {
  switch (getType(config)) {
    case AI_TYPE_RANDOM:
      return chooseRandomMove(board, isWhiteTurn, castle);
    case AI_TYPE_DEPTH_1:
      return chooseDepth1Move(board, isWhiteTurn, castle);
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

export const chooseDepth1Move = (board, isWhiteTurn, castle) => {
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  const startingPointSpread = Board.getPointSpread(board, isWhiteTurn);
  let bestMove = [];
  let bestPointSpreadDiff = -100;
  shuffle(Object.keys(pieces)).forEach((square) => {
    const moves = Move.getLegalMoves(board, isWhiteTurn, castle, square);
    shuffle(moves).forEach((move) => {
      const testBoard = Board.copy(board);
      Board.move(testBoard, isWhiteTurn, square, move);
      const movePointSpread = Board.getPointSpread(testBoard, isWhiteTurn);
      const movePointGain = movePointSpread - startingPointSpread;
      // Castle update is not needed for depth 1, as the poss check is independent for each player
      const otherPieces = isWhiteTurn
        ? Board.getBlackPieces(testBoard) : Board.getWhitePieces(testBoard);
      let worstPointLoss = -100;
      shuffle(Object.keys(otherPieces)).forEach((otherSquare) => {
        const otherMoves = Move.getLegalMoves(testBoard, !isWhiteTurn, castle, otherSquare);
        shuffle(otherMoves).forEach((otherMove) => {
          const otherTestBoard = Board.copy(testBoard);
          Board.move(otherTestBoard, !isWhiteTurn, otherSquare, otherMove);
          const pointLoss = movePointSpread - Board.getPointSpread(otherTestBoard, isWhiteTurn);
          if (pointLoss > worstPointLoss) { worstPointLoss = pointLoss; }
        });
      });
      const movePointGainDiff = movePointGain - worstPointLoss;
      if (movePointGainDiff > bestPointSpreadDiff) {
        bestMove = [square, move];
        bestPointSpreadDiff = movePointGainDiff;
      }
    });
  });
  if (bestMove == []) { console.log("ERROR: Depth 1 AI could not find a move!"); }
  return bestMove;
}
