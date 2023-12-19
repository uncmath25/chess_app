import * as Board from './board';
import * as Move from '../models/move';

export const getMove = (config, board, isWhiteTurn) => {
  return chooseRandomMove(board, isWhiteTurn);
};

export const chooseRandomMove = (board, isWhiteTurn) => {
  let move = "";
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  shuffle(Object.keys(pieces)).forEach((square) => {
    const moves = Move.getMoves(board, isWhiteTurn, square);
    if (moves.length > 0) {
      move = [square, moves[0]];
      return;
    }
  });
  if (move == "") { console.log("AI could not find a move!") }
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
