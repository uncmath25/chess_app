import * as Board from './board';
import * as Castle from './castle';

export const getLegalMoves = (board, isWhiteTurn, castle, square) => {
  const moves = getAllPossibleMoves(board, isWhiteTurn, castle, square)
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  const kingSquare = pieces[square] == Board.KING ? "" : getKingSquare(board, isWhiteTurn);
  return moves.filter((move) => isLegalMove(board, isWhiteTurn, square, move, kingSquare));
};

const getAllPossibleMoves = (board, isWhiteTurn, castle, square) => {
  const [row, col] = Board.getSquareCoords(square);
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  const otherPieces =  isWhiteTurn ? Board.getBlackPieces(board) : Board.getWhitePieces(board);
  switch (pieces[square]) {
    case Board.PAWN:
      return getPawnMoves(pieces, otherPieces, isWhiteTurn, row, col);
    case Board.KNIGHT:
      return getKnightMoves(pieces, row, col);
    case Board.BISHOP:
      return getBishopMoves(pieces, otherPieces, row, col);
    case Board.ROOK:
      return getRookMoves(pieces, otherPieces, row, col);
    case Board.QUEEN:
      return getQueenMoves(pieces, otherPieces, row, col);
    case Board.KING:
      return getKingMoves(pieces, board, isWhiteTurn, castle, row, col);
  }
}
const getPawnMoves = (pieces, otherPieces, isWhiteTurn, row, col) => {
  let moves = [];
  const nextRow = row + (isWhiteTurn ? 1 : -1);
  if (!pieces[Board.getSquare(nextRow, col)] && !otherPieces[Board.getSquare(nextRow, col)]) {
    moves.push(Board.getSquare(nextRow, col));
  }
  const startRow = isWhiteTurn ? 1 : Board.BOARD_SIZE - 2
  const farRow = row + (isWhiteTurn ? 2 : -2);
  if (row == startRow && !pieces[Board.getSquare(farRow, col)] && !otherPieces[Board.getSquare(farRow, col)]) {
    moves.push(Board.getSquare(farRow, col));
  }
  if (col >= 1 && otherPieces[Board.getSquare(nextRow, col - 1)]) {
    moves.push(Board.getSquare(nextRow, col - 1));
  }
  if (col <= Board.BOARD_SIZE - 2 && otherPieces[Board.getSquare(nextRow, col + 1)]) {
    moves.push(Board.getSquare(nextRow, col + 1));
  }
  return moves;
}
const getKnightMoves = (pieces, row, col) => {
  let moves = [];
  const iter = [-2, -1, 1, 2];
  iter.forEach((i) => {
    if (row + i >= 0 && row + i < Board.BOARD_SIZE) {
      [-(3 - Math.abs(i)), (3 - Math.abs(i))].forEach((j) => {
        if (col + j >= 0 && col + j < Board.BOARD_SIZE) {
          if (!pieces[Board.getSquare(row + i, col + j)]) {
            moves.push(Board.getSquare(row + i, col + j));
          }
        }
      });
    }
  });
  return moves;
}
const getMoveInDirection = (pieces, otherPieces, moves, dir, row, col) => {
  let k = 1;
  while (row + dir[0]*k >= 0 && row + dir[0]*k < Board.BOARD_SIZE
    && col + dir[1]*k >= 0 && col + dir[1]*k < Board.BOARD_SIZE
    && !pieces[Board.getSquare(row + dir[0]*k, col + dir[1]*k)]) {
    moves.push(Board.getSquare(row + dir[0]*k, col + dir[1]*k));
    if (otherPieces[Board.getSquare(row + dir[0]*k, col + dir[1]*k)]) { break; }
    k++;
  }
}
const getBishopMoves = (pieces, otherPieces, row, col) => {
  let moves = [];
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(dir =>
    getMoveInDirection(pieces, otherPieces, moves, dir, row, col)
  )
  return moves;
}
const getRookMoves = (pieces, otherPieces, row, col) => {
  let moves = [];
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(dir =>
    getMoveInDirection(pieces, otherPieces, moves, dir, row, col)
  )
  return moves;
}
const getQueenMoves = (pieces, otherPieces, row, col) => {
  return [...getBishopMoves(pieces, otherPieces, row, col), ...getRookMoves(pieces, otherPieces, row, col)];
}
const getKingMoves = (pieces, board, isWhiteTurn, castle, row, col) => {
  let moves = [];
  [-1, 0, 1].forEach((i) => {
    if (row + i >= 0 && row + i < Board.BOARD_SIZE) {
      [-1, 0, 1].forEach((j) => {
        if (col + j >= 0 && col + j < Board.BOARD_SIZE) {
          if (!pieces[Board.getSquare(row + i, col + j)]) {
            moves.push(Board.getSquare(row + i, col + j));
          }
        }
      });
    }
  });
  addCastleMoves(moves, board, isWhiteTurn, castle, true);
  addCastleMoves(moves, board, isWhiteTurn, castle, false);
  return moves;
}
const addCastleMoves = (moves, board, isWhiteTurn, castle, isShort) => {
  if (!Castle.isPossible(castle, isWhiteTurn, isShort)) { return; }
  let isCastlePossible = true;
  Castle.getCastleBetweenSquares(isWhiteTurn, isShort).forEach((square) => {
    if ((isWhiteTurn && Board.isWhitePiece(board, square))
        || (!isWhiteTurn && Board.isBlackPiece(board, square))) {
      isCastlePossible = false; return;
    }
  });
  Castle.getCastleCheckSquares(isWhiteTurn, isShort).forEach((square) => {
    if (canSquareBeAttacked(board, isWhiteTurn, square)) {
      isCastlePossible = false; return;
    }
  });
  if (isCastlePossible) { moves.push(Castle.getCastleSquare(isWhiteTurn, isShort)) };
}

const getKingSquare = (board, isWhiteTurn) => {
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  let kingSquare = "";
  Object.keys(pieces).forEach((square) => {
    if (pieces[square] == Board.KING) { kingSquare = square; return; }
  });
  if (kingSquare == "") { console.log("ERROR: King Square could not be found!") }
  return kingSquare;
}

export const isLegalMove = (board, isWhiteTurn, oldSquare, newSquare, oldKingSquare) => {
  const testBoard = Board.copy(board);
  const kingSquare = (oldKingSquare == "") ? newSquare : oldKingSquare;
  Board.move(testBoard, isWhiteTurn, oldSquare, newSquare);
  return !canSquareBeAttacked(testBoard, isWhiteTurn, kingSquare);
}

export const canSquareBeAttacked = (board, isWhiteTurn, square) => {
  const otherPieces = isWhiteTurn ? Board.getBlackPieces(board) : Board.getWhitePieces(board);
  let foundCheck = false;
  Object.keys(otherPieces).forEach((otherSquare) => {
    // King can not castle into an attack, so castling moves are disabled for this check
    getAllPossibleMoves(board, !isWhiteTurn, Castle.initNotPossible(), otherSquare)
      .forEach((move) => {
        if (move == square) { foundCheck = true; return; }
      }
    );
  });
  return foundCheck;
}

export const isPlayerChecked = (board, isWhiteTurn) => {
  return canSquareBeAttacked(board, isWhiteTurn, getKingSquare(board, isWhiteTurn));
}

export const doesLegalMoveExist = (board, isWhiteTurn, castle) => {
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  let foundLegalMove = false;
  Object.keys(pieces).forEach((square) => {
    if (getLegalMoves(board, isWhiteTurn, castle, square).length > 0) {
      foundLegalMove = true; return;
    }
  });
  return foundLegalMove;
}
