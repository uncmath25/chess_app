import * as Board from './board';

export const getMoves = (board, isWhiteTurn, square) => {
  const moves = getAllPossibleMoves(board, isWhiteTurn, square)
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  const kingSquare = pieces[square] == Board.KING ? "" : getKingSquare(board, isWhiteTurn);
  return moves.filter((move) => isLegalMove(board, isWhiteTurn, square, move, kingSquare));
};

export const isLegalMove = (board, isWhiteTurn, oldSquare, newSquare, oldKingSquare) => {
  const testBoard = Board.copy(board);
  const kingSquare = (oldKingSquare == "") ? newSquare : oldKingSquare;
  Board.move(testBoard, isWhiteTurn, oldSquare, newSquare);
  return !canSquareBeAttacked(testBoard, isWhiteTurn, kingSquare);
}

const getKingSquare = (board, isWhiteTurn) => {
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  let kingSquare = "";
  Object.keys(pieces).forEach((square) => {
    if (pieces[square] == Board.KING) {
      kingSquare = square;
      return;
    }
  });
  if (kingSquare == "") { console.log("King Square could not be found!") }
  return kingSquare;
}

const getAllPossibleMoves = (board, isWhiteTurn, square) => {
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
      return getKingMoves(pieces, row, col);
  }
}
const getPawnMoves = (pieces, otherPieces, isWhiteTurn, row, col) => {
  let moveSquares = [];
  const nextRow = row + (isWhiteTurn ? 1 : -1);
  if (!pieces[Board.getSquare(nextRow, col)] && !otherPieces[Board.getSquare(nextRow, col)]) {
    moveSquares.push(Board.getSquare(nextRow, col));
  }
  const startRow = isWhiteTurn ? 1 : Board.BOARD_SIZE - 2
  const farRow = row + (isWhiteTurn ? 2 : -2);
  if (row == startRow && !pieces[Board.getSquare(farRow, col)] && !otherPieces[Board.getSquare(farRow, col)]) {
    moveSquares.push(Board.getSquare(farRow, col));
  }
  if (col >= 1 && otherPieces[Board.getSquare(nextRow, col - 1)]) {
    moveSquares.push(Board.getSquare(nextRow, col - 1));
  }
  if (col <= Board.BOARD_SIZE - 2 && otherPieces[Board.getSquare(nextRow, col + 1)]) {
    moveSquares.push(Board.getSquare(nextRow, col + 1));
  }
  return moveSquares;
}
const getKnightMoves = (pieces, row, col) => {
  let moveSquares = [];
  const iter = [-2, -1, 1, 2];
  iter.forEach((i) => {
    if (row + i >= 0 && row + i < Board.BOARD_SIZE) {
      [-(3 - Math.abs(i)), (3 - Math.abs(i))].forEach((j) => {
        if (col + j >= 0 && col + j < Board.BOARD_SIZE) {
          if (!pieces[Board.getSquare(row + i, col + j)]) {
            moveSquares.push(Board.getSquare(row + i, col + j));
          }
        }
      });
    }
  });
  return moveSquares;
}
const getMoveInDirection = (pieces, otherPieces, moveSquares, dir, row, col) => {
  let k = 1;
  while (row + dir[0]*k >= 0 && row + dir[0]*k < Board.BOARD_SIZE
    && col + dir[1]*k >= 0 && col + dir[1]*k < Board.BOARD_SIZE
    && !pieces[Board.getSquare(row + dir[0]*k, col + dir[1]*k)]) {
    moveSquares.push(Board.getSquare(row + dir[0]*k, col + dir[1]*k));
    if (otherPieces[Board.getSquare(row + dir[0]*k, col + dir[1]*k)]) { break; }
    k++;
  }
}
const getBishopMoves = (pieces, otherPieces, row, col) => {
  let moveSquares = [];
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(dir =>
    getMoveInDirection(pieces, otherPieces, moveSquares, dir, row, col)
  )
  return moveSquares;
}
const getRookMoves = (pieces, otherPieces, row, col) => {
  let moveSquares = [];
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(dir =>
    getMoveInDirection(pieces, otherPieces, moveSquares, dir, row, col)
  )
  return moveSquares;
}
const getQueenMoves = (pieces, otherPieces, row, col) => {
  return [...getBishopMoves(pieces, otherPieces, row, col), ...getRookMoves(pieces, otherPieces, row, col)];
}
const getKingMoves = (pieces, row, col) => {
  let moveSquares = [];
  [-1, 0, 1].forEach((i) => {
    if (row + i >= 0 && row + i < Board.BOARD_SIZE) {
      [-1, 0, 1].forEach((j) => {
        if (col + j >= 0 && col + j < Board.BOARD_SIZE) {
          if (!pieces[Board.getSquare(row + i, col + j)]) {
            moveSquares.push(Board.getSquare(row + i, col + j));
          }
        }
      });
    }
  });
  return moveSquares;
}

export const isPlayerChecked = (board, isWhiteTurn) => {
  return canSquareBeAttacked(board, isWhiteTurn, getKingSquare(board, isWhiteTurn));
}

export const canSquareBeAttacked = (board, isWhiteTurn, square) => {
  const otherPieces = isWhiteTurn ? Board.getBlackPieces(board) : Board.getWhitePieces(board);
  let foundCheck = false;
  Object.keys(otherPieces).forEach((otherSquare) => {
    getAllPossibleMoves(board, !isWhiteTurn, otherSquare)
      .forEach((move) => {
        if (move == square) {
          foundCheck = true;
          return;
        }
      }
    );
  });
  return foundCheck;
}

export const doesLegalMoveExist = (board, isWhiteTurn) => {
  const pieces = isWhiteTurn ? Board.getWhitePieces(board) : Board.getBlackPieces(board);
  let foundLegalMove = false;
  Object.keys(pieces).forEach((square) => {
    if (getMoves(board, isWhiteTurn, square).length > 0) {
      foundLegalMove = true;
      return;
    }
  });
  return foundLegalMove;
}

// HARD_CODED_RULE
// export const initHasStaringPositionMoved = () => {
//   let hasStartingPositionMoved = {};
//   hasStartingPositionMoved["a1"] = false;
//   hasStartingPositionMoved["e1"] = false;
//   hasStartingPositionMoved["h1"] = false;
//   hasStartingPositionMoved["a8"] = false;
//   hasStartingPositionMoved["e8"] = false;
//   hasStartingPositionMoved["h8"] = false;
//   return hasStartingPositionMoved;
// }

// HARD_CODED_RULE
// export const updateHasStaringPositionMoved = (hasStartingPositionMoved, oldSquare) => {
//   const newHasStartingPositionMoved = Object.assign({}, hasStartingPositionMoved)
//   if (["a1", "e1", "h1", "a8", "e8", "h8"].includes(oldSquare)) {
//     newHasStartingPositionMoved[oldSquare] = true;
//   }
//   return newHasStartingPositionMoved;
// }

// const addCastleMoves = (moveSquares, row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn) => {
//   if (pieces[Board.getSquare(row, col)] != Board.KING) { return; }
//   if (isWhiteTurn && Board.getSquare(row, col) == "e1") {
//     if (!hasStartingPositionMoved["e1"] && !hasStartingPositionMoved["h1"]) {
//       if (!pieces["f1"] && !pieces["g1"]) {
//         // TODO: Add check rules
//         moveSquares.push("g1");
//       }
//     }
//   }
// }
