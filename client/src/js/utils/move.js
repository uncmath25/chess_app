import * as Board from './board';

export const getMoves = (row, col, pieces, otherPieces, isWhiteTurn) => {
  let moves = getAllPossibleMoves(row, col, pieces, otherPieces, isWhiteTurn)
  const square = Board.getSquareNotation(row, col);
  if ((isWhiteTurn && pieces[square] == Board.KING) || (!isWhiteTurn && otherPieces[square] == Board.KING)) {
    moves = moves.filter((square) => !isSquareInCheck(square, pieces, otherPieces, isWhiteTurn));
  }
  return moves;
};

// export const getMoves = (row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn, skipCheck=false) => {
//   let moveSquares = getRawMoveSquares(row, col, pieces, otherPieces, isWhiteTurn);
//   addCastleMoves(moveSquares, row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn);
//   if (skipCheck) { return moveSquares; }
//   let legalMoveSquares = [];
//   const oldSquare = Board.getSquareNotation(row, col);
//   moveSquares.forEach((newSquare) => {
//     const updatedPieces = movePiece(pieces, oldSquare, newSquare);
//     const updatedOtherPieces = removePiece(otherPieces, newSquare);
//     const whitePieces = isWhiteTurn ? updatedPieces : updatedOtherPieces;
//     const blackPieces = isWhiteTurn ? updatedOtherPieces : updatedPieces;
//     if (!isPlayerChecked(whitePieces, blackPieces, hasStartingPositionMoved, isWhiteTurn)) {
//       legalMoveSquares.push(newSquare);
//     }
//   });
//   return legalMoveSquares;
// }

const isSquareInCheck = (square, pieces, otherPieces, isWhiteTurn) => {
  let foundCheck = false;
  for (var row = 0; row < Board.BOARD_SIZE; row++) {
    for (var col = 0; col < Board.BOARD_SIZE; col++) {
      if (otherPieces[Board.getSquareNotation(row, col)]) {
        getAllPossibleMoves(row, col, otherPieces, pieces, !isWhiteTurn, true).forEach((moveSquare) => {
          if (moveSquare == square) {
            foundCheck = true;
            return;
          }
        });
      }
    }
  }
  return foundCheck;
}

// export const isSquareChecked = (square, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn) => {
//   let foundCheck = false;
//   for (var row = 0; row < Board.BOARD_SIZE; row++) {
//     for (var col = 0; col < Board.BOARD_SIZE; col++) {
//       if (otherPieces[Board.getSquareNotation(row, col)]) {
//         getMoves(row, col, otherPieces, pieces, hasStartingPositionMoved, !isWhiteTurn, true).forEach((moveSquare) => {
//           if (moveSquare == square) {
//             foundCheck = true;
//             return;
//           }
//         });
//       }
//     }
//   }
//   return foundCheck;
// }

const getAllPossibleMoves = (row, col, pieces, otherPieces, isWhiteTurn) => {
  switch (pieces[Board.getSquareNotation(row, col)]) {
    case Board.PAWN:
      return getPawnMoves(row, col, pieces, otherPieces, isWhiteTurn);
    case Board.KNIGHT:
      return getKnightMoves(row, col, pieces);
    case Board.BISHOP:
      return getBishopMoves(row, col, pieces, otherPieces);
    case Board.ROOK:
      return getRookMoves(row, col, pieces, otherPieces);
    case Board.QUEEN:
      return getQueenMoves(row, col, pieces, otherPieces);
    case Board.KING:
      return getKingMoves(row, col, pieces);
  }
}
const getPawnMoves = (row, col, pieces, otherPieces, isWhiteTurn) => {
  let moveSquares = [];
  const nextRow = row + (isWhiteTurn ? 1 : -1);
  if (!pieces[Board.getSquareNotation(nextRow, col)] && !otherPieces[Board.getSquareNotation(nextRow, col)]) {
    moveSquares.push(Board.getSquareNotation(nextRow, col));
  }
  const startRow = isWhiteTurn ? 1 : Board.BOARD_SIZE - 2
  const farRow = row + (isWhiteTurn ? 2 : -2);
  if (row == startRow && !pieces[Board.getSquareNotation(farRow, col)] && !otherPieces[Board.getSquareNotation(farRow, col)]) {
    moveSquares.push(Board.getSquareNotation(farRow, col));
  }
  if (col >= 1 && otherPieces[Board.getSquareNotation(nextRow, col - 1)]) {
    moveSquares.push(Board.getSquareNotation(nextRow, col - 1));
  }
  if (col <= Board.BOARD_SIZE - 2 && otherPieces[Board.getSquareNotation(nextRow, col + 1)]) {
    moveSquares.push(Board.getSquareNotation(nextRow, col + 1));
  }
  return moveSquares;
}
const getKnightMoves = (row, col, pieces) => {
  let moveSquares = [];
  const iter = [-2, -1, 1, 2];
  iter.forEach((i) => {
    if (row + i >= 0 && row + i < Board.BOARD_SIZE) {
      [-(3 - Math.abs(i)), (3 - Math.abs(i))].forEach((j) => {
        if (col + j >= 0 && col + j < Board.BOARD_SIZE) {
          if (!pieces[Board.getSquareNotation(row + i, col + j)]) {
            moveSquares.push(Board.getSquareNotation(row + i, col + j));
          }
        }
      });
    }
  });
  return moveSquares;
}
const getMoveInDirection = (row, col, pieces, otherPieces, moveSquares, dir) => {
  let k = 1;
  while (row + dir[0]*k >= 0 && row + dir[0]*k < Board.BOARD_SIZE
    && col + dir[1]*k >= 0 && col + dir[1]*k < Board.BOARD_SIZE
    && !pieces[Board.getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) {
    moveSquares.push(Board.getSquareNotation(row + dir[0]*k, col + dir[1]*k));
    if (otherPieces[Board.getSquareNotation(row + dir[0]*k, col + dir[1]*k)]) { break; }
    k++;
  }
}
const getBishopMoves = (row, col, pieces, otherPieces) => {
  let moveSquares = [];
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(dir =>
    getMoveInDirection(row, col, pieces, otherPieces, moveSquares, dir)
  )
  return moveSquares;
}
const getRookMoves = (row, col, pieces, otherPieces) => {
  let moveSquares = [];
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(dir =>
    getMoveInDirection(row, col, pieces, otherPieces, moveSquares, dir)
  )
  return moveSquares;
}
const getQueenMoves = (row, col, pieces, otherPieces) => {
  return [...getBishopMoves(row, col, pieces, otherPieces), ...getRookMoves(row, col, pieces, otherPieces)];
}
const getKingMoves = (row, col, pieces) => {
  let moveSquares = [];
  [-1, 0, 1].forEach((i) => {
    if (row + i >= 0 && row + i < Board.BOARD_SIZE) {
      [-1, 0, 1].forEach((j) => {
        if (col + j >= 0 && col + j < Board.BOARD_SIZE) {
          if (!pieces[Board.getSquareNotation(row + i, col + j)]) {
            moveSquares.push(Board.getSquareNotation(row + i, col + j));
          }
        }
      });
    }
  });
  return moveSquares;
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

// export const isPlayerChecked = (whitePieces, blackPieces, hasStartingPositionMoved, isWhiteTurn) => {
//   const pieces = isWhiteTurn ? whitePieces : blackPieces;
//   const otherPieces = isWhiteTurn ? blackPieces : whitePieces;
//   let kingSquare = "";
//   Object.keys(pieces).forEach((square) => {
//     if (pieces[square] == Board.KING) {
//       kingSquare = square;
//       return;
//     }
//   });
//   return isSquareChecked(kingSquare, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn);
// }

// export const noLegalMovesExist = (whitePieces, blackPieces, hasStartingPositionMoved, isWhiteTurn) => {
//   const pieces = isWhiteTurn ? whitePieces : blackPieces;
//   const otherPieces = isWhiteTurn ? blackPieces : whitePieces;
//   let foundLegalMove = false;
//   for (var row = 0; row < Board.BOARD_SIZE; row++) {
//     for (var col = 0; col < Board.BOARD_SIZE; col++) {
//       if (pieces[Board.getSquareNotation(row, col)]) {
//         if (getMoves(row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn).length > 0) {
//           foundLegalMove = true;
//           return;
//         }
//       }
//     }
//   }
//   return !foundLegalMove;
// }

// const addCastleMoves = (moveSquares, row, col, pieces, otherPieces, hasStartingPositionMoved, isWhiteTurn) => {
//   if (pieces[Board.getSquareNotation(row, col)] != Board.KING) { return; }
//   if (isWhiteTurn && Board.getSquareNotation(row, col) == "e1") {
//     if (!hasStartingPositionMoved["e1"] && !hasStartingPositionMoved["h1"]) {
//       if (!pieces["f1"] && !pieces["g1"]) {
//         // TODO: Add check rules
//         moveSquares.push("g1");
//       }
//     }
//   }
// }
