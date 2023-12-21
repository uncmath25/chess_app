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
      return chooseDepth1Move(board, isWhiteTurn, castle);
    case AI_TYPE_DEPTH_2:
      return chooseDepth2Move(board, isWhiteTurn, castle);
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
  let bestMove = [];
  let bestPointSpreadDiff = -100;
  shuffle(Object.keys(pieces)).forEach((square) => {
    const moves = Move.getLegalMoves(board, isWhiteTurn, castle, square);
    shuffle(moves).forEach((move) => {
      const [movePointGainDiff, _, __] = getMovePointDiff(board, isWhiteTurn, castle, square, move);
      if (movePointGainDiff > bestPointSpreadDiff) {
        bestMove = [square, move];
        bestPointSpreadDiff = movePointGainDiff;
      }
    });
  });
  if (bestMove == []) { console.log("ERROR: Depth 1 AI could not find a move!"); }
  return bestMove;
}

export const getMovePointDiff = (board, isWhiteTurn, castle, square, move) => {
  const startingPointSpread = Board.getPointSpread(board, isWhiteTurn);
  const testBoard = Board.copy(board);
  Board.move(testBoard, isWhiteTurn, square, move);
  const movePointSpread = Board.getPointSpread(testBoard, isWhiteTurn);
  const movePointGain = movePointSpread - startingPointSpread;
  const otherPieces = isWhiteTurn
    ? Board.getBlackPieces(testBoard) : Board.getWhitePieces(testBoard);
  let worstPointLoss = -100;
  let worstOtherSquare = "";
  let worstOtherMove = "";
  shuffle(Object.keys(otherPieces)).forEach((otherSquare) => {
    const otherMoves = Move.getLegalMoves(testBoard, !isWhiteTurn, castle, otherSquare);
    shuffle(otherMoves).forEach((otherMove) => {
      const otherTestBoard = Board.copy(testBoard);
      Board.move(otherTestBoard, !isWhiteTurn, otherSquare, otherMove);
      const pointLoss = movePointSpread - Board.getPointSpread(otherTestBoard, isWhiteTurn);
      if (pointLoss > worstPointLoss) {
        worstPointLoss = pointLoss;
        worstOtherSquare = otherSquare;
        worstOtherMove = otherMove;
      }
    });
  });
  return [movePointGain - worstPointLoss, worstOtherSquare, worstOtherMove];
}

export const chooseDepth2Move = (board, isWhiteTurn, castle) => {
  const pieces1 = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  let bestMove = [];
  let bestPointSpreadDiff = -100;
  shuffle(Object.keys(pieces1)).forEach((square1) => {
    const moves1 = Move.getLegalMoves(board, isWhiteTurn, castle, square1);
    shuffle(moves1).forEach((move1) => {
      const [movePointGainDiff1, worstOtherSquare1, worstOtherMove1] =
        getMovePointDiff(board, isWhiteTurn, castle, square1, move1);
      const testBoard = Board.copy(board);
      Board.move(testBoard, isWhiteTurn, square1, move1);
      const testCastle = {...castle};
      Castle.update(testCastle, square1);
      const otherTestBoard = Board.copy(testBoard);
      Board.move(otherTestBoard, !isWhiteTurn, worstOtherSquare1, worstOtherMove1);
      Castle.update(testCastle, worstOtherSquare1);
      const pieces2 = isWhiteTurn
        ? Board.getWhitePieces(otherTestBoard) : Board.getBlackPieces(otherTestBoard);
      shuffle(Object.keys(pieces2)).forEach((square2) => {
        const moves2 = Move.getLegalMoves(otherTestBoard, isWhiteTurn, testCastle, square2);
        shuffle(moves2).forEach((move2) => {
          const [movePointGainDiff2, worstOtherSquare2, worstOtherMove2] =
            getMovePointDiff(otherTestBoard, isWhiteTurn, testCastle, square2, move2);
          const movePointGainDiff = movePointGainDiff1 + movePointGainDiff2;
          if (movePointGainDiff > bestPointSpreadDiff) {
            console.log(movePointGainDiff1);
            console.log([square1, move1]);
            console.log(movePointGainDiff);
            console.log("-----------");
            bestMove = [square1, move1];
            bestPointSpreadDiff = movePointGainDiff;
          }
        });
      });
    });
  });
  if (bestMove == []) { console.log("ERROR: Depth 2 AI could not find a move!"); }
  return bestMove;
}
